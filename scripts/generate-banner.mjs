#!/usr/bin/env node
/**
 * Generate the ink-on-paper banner used as the OG image and the
 * /banner.webp public asset. All ink, paper, and screentone: no neon,
 * no gradients. Output:
 *   public/og.png      (1200x630, social cards)
 *   public/banner.webp (1280x320, raw banner asset)
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const PAPER = "#fffdf7";
const INK = "#090909";

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svg(width, height, opts = {}) {
  const { showStats = true, showFootnote = true, dotSize = 6, dotStep = 14 } = opts;
  // Scale type to height so both 1200x630 and 1280x320 read correctly.
  const titleSize = Math.round(height * (showStats ? 0.22 : 0.36));
  const taglineSize = Math.round(height * (showStats ? 0.038 : 0.06));
  const labelSize = Math.round(height * (showStats ? 0.025 : 0.04));
  const issueSize = Math.round(height * 0.035);
  const speedAngle = -18;
  const speedStep = 14;
  const speedLen = Math.hypot(width, height) * 1.1;

  // Halftone dot grid for the right callout panel.
  const dotsW = Math.round(width * 0.28);
  const dotsX = width - dotsW - Math.round(width * 0.05);
  const dotsY = Math.round(height * 0.30);
  const dotsH = Math.round(height * 0.40);

  const speedLines = [];
  for (let x = -speedLen; x < width + speedLen; x += speedStep) {
    speedLines.push(
      `<line x1="${x}" y1="${-speedLen}" x2="${x + Math.tan((speedAngle * Math.PI) / 180) * speedLen}" y2="${speedLen}" stroke="${INK}" stroke-opacity="0.07" stroke-width="1"/>`
    );
  }

  const headerH = Math.round(height * (showStats ? 0.075 : 0.18));
  const padX = Math.round(width * 0.045);
  const titleY = Math.round(height * (showStats ? 0.50 : 0.70));
  const taglineY = titleY + Math.round(height * (showStats ? 0.07 : 0.13));
  const labelY = Math.round(height * 0.05);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="halftone" patternUnits="userSpaceOnUse" width="${dotStep}" height="${dotStep}">
      <circle cx="${dotStep / 2}" cy="${dotStep / 2}" r="${dotSize / 4}" fill="${INK}" fill-opacity="0.55"/>
    </pattern>
    <pattern id="paper-grid" patternUnits="userSpaceOnUse" width="44" height="44">
      <rect width="44" height="44" fill="${PAPER}"/>
      <line x1="0" y1="0" x2="44" y2="0" stroke="${INK}" stroke-opacity="0.04" stroke-width="1"/>
      <line x1="0" y1="0" x2="0" y2="44" stroke="${INK}" stroke-opacity="0.05" stroke-width="1"/>
      <circle cx="16" cy="16" r="1" fill="${INK}" fill-opacity="0.10"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#paper-grid)"/>

  <!-- speed lines -->
  <g>${speedLines.join("")}</g>

  <!-- outer ink frame -->
  <rect x="6" y="6" width="${width - 12}" height="${height - 12}" fill="none" stroke="${INK}" stroke-width="3"/>

  <!-- header bar -->
  <rect x="6" y="6" width="${width - 12}" height="${headerH}" fill="${INK}"/>
  <text x="${padX}" y="${headerH * 0.7}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="${labelSize}" fill="${PAPER}" font-weight="700">GAMES · SELF-HOSTED TOOLS · NATIVE APPS</text>
  <text x="${width - padX}" y="${headerH * 0.7}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="${labelSize}" fill="${PAPER}" font-weight="700" text-anchor="end">${escape("GITHUB.COM/8TP")}</text>

  <!-- handle label -->
  <text x="${padX}" y="${labelY + headerH}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="${labelSize * 1.05}" fill="${INK}" font-weight="700">// 8tp / home</text>

  <!-- big title -->
  <text x="${padX}" y="${titleY}" font-family="Space Grotesk, Arial Black, sans-serif" font-size="${titleSize}" fill="${INK}" font-weight="900" letter-spacing="-2">8tp.dev</text>

  <!-- tagline -->
  <text x="${padX}" y="${taglineY}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="${taglineSize}" fill="${INK}" font-weight="500">games, self-hosted tools, and native apps</text>

  ${showFootnote ? `
  <!-- ascii rule -->
  <text x="${padX}" y="${height - padX * 0.9}" font-family="JetBrains Mono, monospace" font-size="${labelSize * 0.95}" fill="${INK}" fill-opacity="0.55">--------------------------------- github.com/8tp</text>
  ` : ""}

  ${showStats ? `
  <!-- halftone block -->
  <rect x="${dotsX}" y="${dotsY}" width="${dotsW}" height="${dotsH}" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
  <rect x="${dotsX + 8}" y="${dotsY + 8}" width="${dotsW - 16}" height="${dotsH - 16}" fill="url(#halftone)"/>
  <rect x="${dotsX + 14}" y="${dotsY + 14}" width="${dotsW - 28}" height="${dotsH - 28}" fill="${INK}"/>
  <text x="${dotsX + dotsW / 2}" y="${dotsY + dotsH / 2 - issueSize * 1.1}" font-family="JetBrains Mono, monospace" font-size="${issueSize}" fill="${PAPER}" text-anchor="middle" font-weight="700">games.</text>
  <text x="${dotsX + dotsW / 2}" y="${dotsY + dotsH / 2}" font-family="JetBrains Mono, monospace" font-size="${issueSize}" fill="${PAPER}" text-anchor="middle" font-weight="700">tools.</text>
  <text x="${dotsX + dotsW / 2}" y="${dotsY + dotsH / 2 + issueSize * 1.1}" font-family="JetBrains Mono, monospace" font-size="${issueSize}" fill="${PAPER}" text-anchor="middle" font-weight="700">native apps.</text>
  ` : ""}
</svg>`;
}

async function render(svgString, outFile, format) {
  const pipeline = sharp(Buffer.from(svgString));
  const buf = format === "webp"
    ? await pipeline.webp({ quality: 92, effort: 5 }).toBuffer()
    : await pipeline.png({ compressionLevel: 9 }).toBuffer();
  await writeFile(outFile, buf);
  return buf.byteLength;
}

const ogBytes = await render(svg(1200, 630, { showStats: true }), path.resolve("public/og.png"), "png");
console.log(`og.png       ${(ogBytes / 1024).toFixed(1)} KB`);

const bannerBytes = await render(
  svg(1280, 320, { showStats: false, showFootnote: false }),
  path.resolve("public/banner.webp"),
  "webp"
);
console.log(`banner.webp  ${(bannerBytes / 1024).toFixed(1)} KB`);
