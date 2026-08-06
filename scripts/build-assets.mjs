/**
 * Build every owned image asset from code.
 *
 *   pnpm assets
 *
 * 1. Identity — favicon.svg (H monogram, theme-aware), favicon.ico, PNG
 *    favicons, apple-touch-icon, PWA icons, site.webmanifest.
 * 2. Open Graph card — 1200x630, paper and ink, name plus thesis.
 * 3. Product stills — crops of assets-src/stills/*.png, tone-mapped onto the
 *    site's own ink..paper range so a screenshot sits on the sheet rather than
 *    punching a hole in it. Skipped silently when the sources are absent; the
 *    graded WebP output is committed, so a clean checkout still builds.
 *
 * Capture the sources with `pnpm stills` first.
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const PUBLIC = path.resolve("public");
const STILLS_SRC = path.resolve("assets-src/stills");

/* Keep in step with src/styles/global.css. */
const INK = [23, 24, 22];
const PAPER = [246, 246, 243];
const INK_HEX = "#171816";
const PAPER_HEX = "#f6f6f3";
const DARK_PAPER_HEX = "#101411";
const DARK_INK_HEX = "#e8eae5";

/* Concrete families: librsvg resolves through fontconfig, not the CSS
   `ui-serif` / `ui-sans-serif` keywords the site uses. */
const SERIF = "Iowan Old Style, Charter, Palatino, Georgia, Times New Roman, serif";
const SANS = "SF Pro Text, Helvetica Neue, Helvetica, Arial, sans-serif";

mkdirSync(PUBLIC, { recursive: true });
mkdirSync(path.join(PUBLIC, "projects"), { recursive: true });
mkdirSync(path.join(PUBLIC, "clients"), { recursive: true });

/* ------------------------------------------------------------------ identity */

/**
 * A quiet H monogram: paper letterform knocked out of an ink tile. Reversed
 * rather than ink-on-paper because a filled tile is what survives a 16px
 * browser tab. The internal media query flips it for dark UI.
 */
const H_PATH = "M17 15h7.5v13.2h15V15H47v34h-7.5V35.4h-15V49H17z";

const monogram = (tile, mark, style = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">${style}
  <rect width="64" height="64" rx="14" fill="${tile}" />
  <path d="${H_PATH}" fill="${mark}" />
</svg>
`;

writeFileSync(
  path.join(PUBLIC, "favicon.svg"),
  monogram(
    INK_HEX,
    PAPER_HEX,
    `
  <style>
    @media (prefers-color-scheme: dark) {
      rect { fill: ${DARK_INK_HEX}; }
      path { fill: ${DARK_PAPER_HEX}; }
    }
  </style>`,
  ),
);

/** Rasters bake the light colourway; the SVG covers theme-aware clients. */
const rasterSvg = monogram(INK_HEX, PAPER_HEX);

async function png(size, { flatten = false } = {}) {
  let pipeline = sharp(Buffer.from(rasterSvg), { density: 384 }).resize(size, size);
  if (flatten) pipeline = pipeline.flatten({ background: PAPER_HEX });
  return pipeline.png({ compressionLevel: 9 }).toBuffer();
}

for (const [size, name] of [
  [16, "favicon-16.png"],
  [32, "favicon-32.png"],
  [192, "icon-192.png"],
  [512, "icon-512.png"],
]) {
  writeFileSync(path.join(PUBLIC, name), await png(size));
}

/* iOS composites on the raw bitmap, so this one is flattened onto paper. */
writeFileSync(path.join(PUBLIC, "apple-touch-icon.png"), await png(180, { flatten: true }));

/** PNG-in-ICO. Every browser that still asks for favicon.ico understands it. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

writeFileSync(
  path.join(PUBLIC, "favicon.ico"),
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) })))),
);

writeFileSync(
  path.join(PUBLIC, "site.webmanifest"),
  `${JSON.stringify(
    {
      name: "Hunter M.",
      short_name: "Hunter M.",
      description: "Realtime games, self-hosted tools, native apps, commercial web.",
      start_url: "/",
      display: "minimal-ui",
      background_color: PAPER_HEX,
      theme_color: PAPER_HEX,
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      ],
    },
    null,
    2,
  )}\n`,
);

/* ------------------------------------------------------------------ og card */

const OG_W = 1200;
const OG_H = 630;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">
  <defs>
    <pattern id="dither" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${INK_HEX}" fill-opacity="0.10" />
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="1" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
    <mask id="fademask">
      <rect width="${OG_W}" height="${OG_H}" fill="url(#fade)" />
    </mask>
  </defs>

  <rect width="${OG_W}" height="${OG_H}" fill="${PAPER_HEX}" />
  <rect width="${OG_W}" height="${OG_H}" fill="url(#dither)" mask="url(#fademask)" />

  <text x="84" y="252" font-family="${SERIF}" font-size="76" fill="${INK_HEX}">Hunter M.</text>

  <g font-family="${SANS}" font-size="27" fill="${INK_HEX}" fill-opacity="0.64">
    <text x="84" y="330">Realtime multiplayer games, self-hosted tools,</text>
    <text x="84" y="372">native macOS apps, and commercial storefronts.</text>
  </g>

  <rect x="84" y="472" width="1032" height="1" fill="${INK_HEX}" fill-opacity="0.12" />

  <g font-family="${SANS}" font-size="22" fill="${INK_HEX}" fill-opacity="0.46">
    <text x="84" y="518">Instagib Arena &#183; Palhelm &#183; Aeperion</text>
    <text x="1116" y="518" text-anchor="end">github.com/8tp</text>
  </g>
</svg>
`;

await sharp(Buffer.from(ogSvg))
  .png({ compressionLevel: 9 })
  .toFile(path.join(PUBLIC, "og.png"));

/* ------------------------------------------------------------------- stills */

/**
 * Crops are chosen by hand per capture: one legible region, not a whole page.
 * `out` is the path under public/.
 */
const STILLS = [
  {
    src: "instagib",
    out: "projects/instagib-arena.webp",
    crop: { left: 320, top: 30, width: 1290, height: 806 },
  },
  {
    src: "palhelm",
    out: "projects/palhelm.webp",
    crop: { left: 340, top: 1540, width: 2200, height: 1375 },
  },
  { src: "coup", out: "projects/coup.webp", crop: { left: 800, top: 560, width: 1400, height: 875 } },
  {
    src: "imprimatur",
    out: "projects/imprimatur.webp",
    crop: { left: 114, top: 70, width: 2148, height: 1342 },
  },
  {
    src: "typeduel",
    out: "projects/typeduel.webp",
    crop: { left: 560, top: 300, width: 1866, height: 1166 },
  },
  {
    src: "vitals",
    out: "projects/vitals.webp",
    crop: { left: 300, top: 260, width: 2200, height: 1375 },
  },
  {
    src: "hudaim",
    out: "projects/hudaim.webp",
    crop: { left: 200, top: 150, width: 2480, height: 1550 },
  },
  {
    src: "aeperion",
    out: "clients/aeperion-after.webp",
    crop: { left: 0, top: 0, width: 2880, height: 1800 },
  },
  {
    src: "startpage",
    out: "projects/startpage.webp",
    crop: { left: 340, top: 150, width: 2200, height: 1375 },
  },
  /* Drop a pre-redesign capture here and it grades with everything else. */
  {
    src: "aeperion-before",
    out: "clients/aeperion-before.webp",
    crop: { left: 0, top: 0, width: 2880, height: 1800 },
    optional: true,
  },
];

/* Map [0,255] onto [ink, paper] per channel. */
const slope = PAPER.map((p, i) => (p - INK[i]) / 255);

let graded = 0;
for (const still of STILLS) {
  const file = path.join(STILLS_SRC, `${still.src}.png`);
  if (!existsSync(file)) continue;

  await sharp(file)
    .extract(still.crop)
    .resize(1280, 800, { fit: "cover" })
    /* Keep a trace of the product's own hue; drop the shout. */
    .modulate({ saturation: 0.62 })
    .linear(slope, INK)
    .webp({ quality: 80 })
    .toFile(path.join(PUBLIC, still.out));
  graded += 1;
}

console.log(
  `assets: identity + og written to public/; ${graded} still${graded === 1 ? "" : "s"} graded` +
    (graded ? "" : " (run `pnpm stills` to capture sources)"),
);
