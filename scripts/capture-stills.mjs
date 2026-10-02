/**
 * Capture real product stills from the live projects.
 *
 *   pnpm stills
 *
 * Writes full-resolution PNGs to assets-src/stills/ (gitignored). Run
 * `pnpm assets` afterwards to crop, grade and encode them into
 * public/projects/ and public/clients/.
 *
 * Requires a Chromium. It looks for Playwright's cached chrome-headless-shell
 * first, then a locally installed Chrome. Nothing here is a build dependency —
 * the graded WebP output is committed, so a normal `pnpm build` never needs it.
 *
 * Some targets need a click or two to get past a splash screen; those steps are
 * declared per target below. `js:` steps are evaluated in the page.
 *
 * Pass names to capture a subset — `pnpm stills aeperion-tall aeperion-tall-dark` — which
 * matters because a full run walks every live site and takes minutes.
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import os from "node:os";

const OUT = path.resolve("assets-src/stills");
const PORT = 9331;
const VIEWPORT = { width: 1440, height: 900, scale: 2 };

const CANDIDATES = [
  ...["1234", "1208"].map((v) =>
    path.join(
      os.homedir(),
      `Library/Caches/ms-playwright/chromium_headless_shell-${v}/chrome-headless-shell-mac-arm64/chrome-headless-shell`,
    ),
  ),
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];

const aepTheme = (mode) =>
  `js:localStorage.setItem('aep-theme','${mode}');` +
  `document.documentElement.dataset.theme='${mode}';` +
  `return document.documentElement.dataset.theme;`;

/** name → url, plus any clicks needed to reach a representative screen. */
const TARGETS = [
  { name: "instagib", url: "https://instagib.win", steps: ["Enter the arena", "Play as guest"] },
  { name: "palhelm", url: "https://palhelm.com", height: 2400 },
  { name: "coup", url: "https://coup.8tp.dev", steps: ["Tutorial"] },
  { name: "typeduel", url: "https://duel.8tp.dev", steps: ["Practice Mode"] },
  { name: "vitals", url: "https://vitals.8tp.dev" },
  {
    name: "hudaim",
    url: "https://aim.8tp.dev",
    steps: [
      "js:const i=document.querySelector('input');if(!i)return 'no input';" +
        "const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;" +
        "s.call(i,'Guest');i.dispatchEvent(new Event('input',{bubbles:true}));return 'typed';",
      "Start Training",
    ],
  },
  /*
   * Aeperion ships its own light/dark switcher, so it is captured twice and the
   * case study swaps frames with this site's theme. Its bootstrap reads
   * localStorage `aep-theme` and stamps `data-theme` on <html>; setting both
   * covers the site whether it re-reads storage or watches the attribute.
   *
   * Light is set explicitly rather than left to the default so the two frames
   * differ only by the thing under test.
   */
  /* Full-length pages for the client frames, which scroll on hover. */
  { name: "aeperion-tall", url: "https://aeperion.com", height: 3600, steps: [aepTheme("light")] },
  { name: "aeperion-tall-dark", url: "https://aeperion.com", height: 3600, scheme: "dark", steps: [aepTheme("dark")] },
  /* MouseRank and Aimperion show a first-visit consent bar; "OK" dismisses it. */
  { name: "mouserank-tall", url: "https://mouserank.org", height: 1800, steps: ["^OK$"] },
  { name: "mouserank-tall-dark", url: "https://mouserank.org", height: 1800, scheme: "dark", steps: ["^OK$"] },
  { name: "chudopoly", url: "https://chudopoly.deal" },
  { name: "chudopoly-dark", url: "https://chudopoly.deal", scheme: "dark" },
  { name: "palhelm-dark", url: "https://palhelm.com", height: 2400, scheme: "dark" },
  { name: "hatchdle", url: "https://hatchdle.com" },
  { name: "hatchdle-dark", url: "https://hatchdle.com", scheme: "dark" },
  { name: "aimperion", url: "https://aimperion.com", steps: ["^OK$"] },
];

/* Optional allow-list from argv. */
const only = new Set(process.argv.slice(2));
const targets = only.size ? TARGETS.filter((t) => only.has(t.name)) : TARGETS;
if (only.size && !targets.length) {
  console.error(`No target matches ${[...only].join(", ")}.`);
  process.exit(1);
}

const bin = CANDIDATES.find((p) => existsSync(p));
if (!bin) {
  console.error("No Chromium found. Install Chrome, or run `npx playwright install chromium`.");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const chrome = spawn(bin, [
  "--headless=new",
  "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader",
  "--hide-scrollbars",
  "--no-sandbox",
  "--mute-audio",
  "--disable-background-timer-throttling",
  `--remote-debugging-port=${PORT}`,
  `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
  "about:blank",
]);
chrome.stderr.on("data", () => {});

for (let i = 0; i < 80; i++) {
  try {
    if ((await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok) break;
  } catch {}
  await sleep(250);
}

async function withPage(fn) {
  const target = await (
    await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener("open", res, { once: true });
    ws.addEventListener("error", rej, { once: true });
  });

  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    const p = pending.get(m.id);
    if (!p) return;
    pending.delete(m.id);
    m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result);
  });
  const send = (method, params = {}) => {
    const mid = ++id;
    ws.send(JSON.stringify({ id: mid, method, params }));
    return new Promise((resolve, reject) => {
      pending.set(mid, { resolve, reject });
      setTimeout(() => pending.delete(mid) && reject(new Error(`${method} timed out`)), 30000);
    });
  };

  try {
    return await fn(send);
  } finally {
    ws.close();
    await fetch(`http://127.0.0.1:${PORT}/json/close/${target.id}`).catch(() => {});
  }
}

const clickScript = (text) => `(() => {
  const nodes = [...document.querySelectorAll('button, a, [role=button], li')];
  const hit = nodes.find((n) => new RegExp(${JSON.stringify(text)}, 'i').test((n.innerText || '').trim()) && n.offsetParent !== null);
  if (!hit) return 'miss';
  hit.click();
  return 'hit';
})()`;

for (const target of targets) {
  try {
    await withPage(async (send) => {
      const evaluate = async (expression) =>
        (await send("Runtime.evaluate", { expression, returnByValue: true })).result?.value;

      await send("Emulation.setDeviceMetricsOverride", {
        width: VIEWPORT.width,
        height: target.height ?? VIEWPORT.height,
        deviceScaleFactor: VIEWPORT.scale,
        mobile: false,
      });
      /* Sites that follow the OS theme get it from here; sites with their own
         switcher also need a step that sets it. */
      await send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-color-scheme", value: target.scheme ?? "light" }],
      });
      await send("Page.enable");
      await send("Page.navigate", { url: target.url });
      await sleep(9000);

      for (const step of target.steps ?? []) {
        const result = step.startsWith("js:")
          ? await evaluate(`(() => { ${step.slice(3)} })()`)
          : await evaluate(clickScript(step));
        console.log(`  ${target.name}: ${step.slice(0, 24)} → ${result}`);
        await sleep(6000);
      }

      const shot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
      writeFileSync(path.join(OUT, `${target.name}.png`), Buffer.from(shot.data, "base64"));
      console.log(`${target.name}: captured`);
    });
  } catch (err) {
    console.error(`${target.name}: FAILED — ${err.message}`);
  }
}

chrome.kill("SIGKILL");
process.exit(0);
