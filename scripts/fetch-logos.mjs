/**
 * Pull each project's real logo from its own repo (or its live site).
 *
 *   pnpm logos
 *
 * Sources land in assets-src/logos/, which is gitignored — `pnpm assets` then
 * grades them into public/logos/, and those outputs are committed, exactly the
 * arrangement the product stills use. A clean checkout builds without ever
 * needing to run this.
 *
 * Why per-repo paths rather than scraping each live favicon: only seven of the
 * projects are deployed sites at all. The CLIs, the TUIs and the native apps
 * keep their mark in the repo — often a dedicated one (`assets/mark.svg`), which
 * is a better asset than the favicon anyway.
 *
 * Requires `gh` to be authenticated; it reads through the API so private repos
 * work the same as public ones.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("assets-src/logos");
mkdirSync(OUT, { recursive: true });

/** slug -> where its mark actually lives. `ref` only when not the default. */
const SOURCES = {
  "instagib-arena": { repo: "instagib-arena", file: "public/favicon.svg" },
  palhelm: { repo: "palhelm", file: "assets/mark.svg" },
  imprimatur: { repo: "imprimatur", file: "assets/brand/app-icon.png" },
  coup: { repo: "Coup", file: "public/coup-logo-transparent.png" },
  startpage: { repo: "startpage", file: "favicon.svg" },
  vitals: { repo: "Vitals-Command-Center", file: "apps/web/public/icon.svg" },
  typeduel: { repo: "typeduel", file: "packages/client/public/favicon.svg" },
  hudaim: { repo: "hudaim", file: "public/favicon.svg" },
  tidewatcher: { repo: "tidewatcher", file: "assets/tidewatcher-mark.svg" },
  antmaze: { repo: "AntMaze", file: "assets/logo.svg" },

  /* Shopify serves the storefront's mark off the theme's asset directory. */
  aeperion: { url: "https://aeperion.com/cdn/shop/t/16/assets/aep-favicon.svg" },

  /* wc26-bracket has no icon file — its favicon is a data: URI inlined in
     index.html, reproduced here rather than parsed back out of the markup. */
  "wc26-bracket": {
    inline: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="white" stroke="#17191d" stroke-width="11"/><circle cx="50" cy="50" r="13" fill="#d4af37"/></svg>\n`,
  },
};

/*
 * Deliberately absent, so nobody goes looking for a path that was never there:
 *
 *   palhelm-bot  no mark of its own; the docs site borrows Palhelm's
 *   screencap    README points at a third-party icons8 glyph, not an owned mark
 *   netmap       only a wide README banner, no square mark
 *   litestats    AppIcon.appiconset holds a Contents.json and no image
 *   recopy       same
 *
 * These fall back to the drawn glyph in src/data/marks.ts.
 */

const gh = (args) => execFileSync("gh", args, { maxBuffer: 64 * 1024 * 1024 });

let written = 0;
for (const [slug, src] of Object.entries(SOURCES)) {
  let body;
  let ext = ".svg";

  if (src.inline) {
    body = Buffer.from(src.inline);
  } else if (src.url) {
    body = execFileSync("curl", ["-sL", "--max-time", "20", src.url], {
      maxBuffer: 64 * 1024 * 1024,
    });
    ext = path.extname(new URL(src.url).pathname) || ".svg";
  } else {
    const ref = src.ref ?? gh(["api", `repos/8tp/${src.repo}`, "--jq", ".default_branch"]).toString().trim();
    const b64 = gh([
      "api",
      `repos/8tp/${src.repo}/contents/${src.file}?ref=${ref}`,
      "--jq",
      ".content",
    ]).toString();
    body = Buffer.from(b64, "base64");
    ext = path.extname(src.file);
  }

  if (!body?.length) {
    console.warn(`logos: ${slug} came back empty — skipped`);
    continue;
  }

  writeFileSync(path.join(OUT, slug + ext), body);
  written += 1;
}

console.log(`logos: ${written} source mark${written === 1 ? "" : "s"} in assets-src/logos/`);
