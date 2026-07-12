#!/usr/bin/env node
/**
 * Generate poster-card thumbnails for Palhelm and Palhelm Bot.
 *
 * Two variants per project, both 512x320:
 *   - "-bw.webp"  dark ink poster used by the site (public/projects/)
 *   - ".webp"     Tokyo Night colored poster used by the profile README
 *
 * Rendered from inline SVG via sharp, so the output is deterministic and
 * needs no external image API. Matches the existing dark poster thumbnails
 * (white display type on near-black, one accent line, quiet mono footer).
 *
 * Usage: node scripts/generate-palhelm-thumbs.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const W = 512;
const H = 320;

const DISPLAY = "'Space Grotesk','Helvetica Neue',Arial,sans-serif";
const MONO = "'JetBrains Mono',Menlo,'DejaVu Sans Mono',monospace";

/** @typedef {{eyebrow:string,title:{a:string,b:string},subtitle:string,footer:string,accent:string}} Poster */

/** @type {Record<string, Poster>} */
const posters = {
  palhelm: {
    eyebrow: "SELF-HOSTED  ·  PALWORLD",
    title: { a: "PAL", b: "HELM" },
    subtitle: "Palworld server admin panel",
    footer: "dashboard · players · map · rcon · backups",
    accent: "#9ece6a", // green
  },
  "palhelm-bot": {
    eyebrow: "DISCORD  ·  COMPANION",
    title: { a: "PALHELM", b: " BOT" },
    subtitle: "Your server, in Discord",
    footer: "/status  /players  /map  /ask  ·  30+ commands",
    accent: "#73daca", // mint
  },
};

/** Escape XML-special chars in label text. */
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Build the poster SVG.
 * @param {Poster} p
 * @param {"bw"|"color"} mode
 */
function svg(p, mode) {
  const color =
    mode === "bw"
      ? {
          bg0: "#111114",
          bg1: "#050506",
          streak: "#ffffff",
          eyebrow: "#8a8a90",
          titleA: "#ffffff",
          titleB: "#c9c9cf",
          subtitle: "#e6e6e8",
          footer: "#7c7c82",
          rule: "#3a3a40",
          accent: "#ffffff",
        }
      : {
          bg0: "#1f2335",
          bg1: "#16161e",
          streak: p.accent,
          eyebrow: "#737aa2",
          titleA: "#c0caf5",
          titleB: p.accent,
          subtitle: "#a9b1d6",
          footer: "#737aa2",
          rule: "#3b4261",
          accent: p.accent,
        };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="24%" cy="18%" r="95%">
      <stop offset="0%" stop-color="${color.bg0}"/>
      <stop offset="100%" stop-color="${color.bg1}"/>
    </radialGradient>
    <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0%" stop-color="${color.streak}" stop-opacity="0"/>
      <stop offset="55%" stop-color="${color.streak}" stop-opacity="${mode === "bw" ? 0.22 : 0.16}"/>
      <stop offset="100%" stop-color="${color.streak}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="150" width="${W}" height="2" fill="url(#streak)"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${color.rule}" stroke-width="1"/>

  <text x="40" y="70" font-family="${MONO}" font-size="13" letter-spacing="3"
        fill="${color.eyebrow}">${esc(p.eyebrow)}</text>

  <text x="38" y="150" font-family="${DISPLAY}" font-weight="700" font-size="66" letter-spacing="-1" xml:space="preserve"><tspan fill="${color.titleA}">${esc(p.title.a)}</tspan><tspan fill="${color.titleB}">${esc(p.title.b)}</tspan></text>

  <text x="40" y="196" font-family="${DISPLAY}" font-weight="600" font-size="22"
        fill="${color.subtitle}">${esc(p.subtitle)}</text>

  <rect x="40" y="236" width="34" height="3" fill="${color.accent}"/>
  <text x="40" y="278" font-family="${MONO}" font-size="14"
        fill="${color.footer}">${esc(p.footer)}</text>
</svg>`;
}

async function render(svgStr, outPath) {
  await mkdir(dirname(outPath), { recursive: true });
  const buf = await sharp(Buffer.from(svgStr), { density: 220 })
    .resize(W, H)
    .webp({ quality: 92 })
    .toBuffer();
  await writeFile(outPath, buf);
  console.log(`wrote ${outPath} (${buf.length} bytes)`);
}

const SITE = resolve(REPO_ROOT, "public/projects");
// Profile README repo sits next to this one; override with README_ASSETS.
const README = process.env.README_ASSETS ??
  resolve(REPO_ROOT, "../8tp/assets/projects");

for (const [slug, poster] of Object.entries(posters)) {
  await render(svg(poster, "bw"), `${SITE}/${slug}-bw.webp`);
  await render(svg(poster, "color"), `${README}/${slug}.webp`);
}
console.log("done");
