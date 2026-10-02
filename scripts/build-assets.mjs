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
import { mkdirSync, writeFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const PUBLIC = path.resolve("public");
const STILLS_SRC = path.resolve("assets-src/stills");
const LOGOS_SRC = path.resolve("assets-src/logos");

/* Keep in step with src/styles/global.css. */
const INK = [23, 24, 22];
const PAPER = [246, 246, 243];
const DARK_PAPER = [16, 20, 17];
const DARK_INK = [232, 234, 229];
const INK_HEX = "#171816";
const PAPER_HEX = "#f6f6f3";

/* Concrete families: librsvg resolves through fontconfig, not the CSS
   `ui-serif` / `ui-sans-serif` keywords the site uses. */
const SERIF = "Iowan Old Style, Charter, Palatino, Georgia, Times New Roman, serif";
const SANS = "SF Pro Text, Helvetica Neue, Helvetica, Arial, sans-serif";

mkdirSync(PUBLIC, { recursive: true });
mkdirSync(path.join(PUBLIC, "projects"), { recursive: true });
mkdirSync(path.join(PUBLIC, "clients"), { recursive: true });
mkdirSync(path.join(PUBLIC, "logos"), { recursive: true });

/* ------------------------------------------------------------------ identity */

/**
 * The mark: a lowercase serif h in paper, knocked out of an ink tile. A filled
 * tile is what survives a 16px browser tab, and lowercase serif keeps it from
 * reading as a dating-app capital H. The tile stays ink in both themes.
 *
 * The outline is the "h" from Source Serif 4 Semibold (Adobe, SIL Open Font
 * License, which permits embedding glyph outlines in a logo), placed in the
 * 64x64 box with opentype.js. Semibold because Regular thins out at 16px and
 * Bold fills its counter in.
 */
const H_PATH =
  "M30.05 50.85L17.70 50.85L17.70 48.80L21.00 48.15Q21.05 46.30 21.05 44.13Q21.05 41.95 21.05 40.35L21.05 40.35L21.05 18.85L17.40 18.35L17.40 16.40L26.30 14.15L27.05 14.60L26.85 21.70L26.85 30.65Q30.75 26.20 35.45 26.20L35.45 26.20Q38.70 26.20 40.47 28.35Q42.25 30.50 42.25 35.15L42.25 35.15L42.25 40.35Q42.25 42.05 42.25 44.17Q42.25 46.30 42.30 48.20L42.30 48.20L45.40 48.80L45.40 50.85L33.05 50.85L33.05 48.80L36.25 48.15Q36.30 46.30 36.30 44.17Q36.30 42.05 36.30 40.35L36.30 40.35L36.30 35.65Q36.30 32.65 35.52 31.52Q34.75 30.40 32.85 30.40L32.85 30.40Q30.10 30.40 27.00 33.30L27.00 33.30L27.00 40.35Q27.00 42 27.00 44.15Q27.00 46.30 27.05 48.20L27.05 48.20L30.05 48.80L30.05 50.85Z";

const monogram = (tile, mark) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="${tile}" />
  <path d="${H_PATH}" fill="${mark}" />
</svg>
`;

writeFileSync(path.join(PUBLIC, "favicon.svg"), monogram(INK_HEX, PAPER_HEX));

/** Rasters use the same colours as the SVG. */
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

/* -------------------------------------------------------------------- logos */

/**
 * Each project's own mark, normalised for the entry lists.
 *
 * Vectors are passed through rather than rasterised. Two of them — Aeperion's
 * and the startpage's — carry an internal `prefers-color-scheme` rule, and
 * baking those to a bitmap freezes whichever colourway the rasteriser happened
 * to resolve. Aeperion's is near-black on transparent, so the frozen copy
 * disappears against dark paper entirely.
 *
 * Passing the SVG through fixes the colour but not the trigger: an SVG loaded
 * through <img> resolves that media query against the *operating system*, not
 * against this site's theme attribute, so the toggle would desync it. So any
 * mark carrying the rule is split here into explicit -light/-dark files that
 * CSS can swap on [data-theme]. Marks without the rule stay a single file.
 *
 * Bitmap sources are the exception: two app icons that only exist as large
 * PNGs, resized once to a sane delivery size.
 */
const THEME_RULE = /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*\{/i;

/** Find the body of the dark block, and where it ends, by brace matching. */
function splitThemedSvg(svg) {
  const open = svg.match(THEME_RULE);
  if (!open) return null;

  const bodyStart = open.index + open[0].length;
  let depth = 1;
  let i = bodyStart;
  for (; i < svg.length && depth > 0; i += 1) {
    if (svg[i] === "{") depth += 1;
    else if (svg[i] === "}") depth -= 1;
  }
  const body = svg.slice(bodyStart, i - 1);

  return {
    /* Light: drop the override and keep the base rules as authored. */
    light: svg.slice(0, open.index) + svg.slice(i),
    /* Dark: unwrap it. The rules already sit after the base ones at equal
       specificity, so simply removing the wrapper lets them win. */
    dark: svg.slice(0, open.index) + body + svg.slice(i),
  };
}

const logoManifest = {};
if (existsSync(LOGOS_SRC)) {
  for (const file of readdirSync(LOGOS_SRC).sort()) {
    const { name: slug, ext } = path.parse(file);
    const from = path.join(LOGOS_SRC, file);

    if (ext.toLowerCase() === ".svg") {
      const svg = readFileSync(from, "utf8");
      const themed = splitThemedSvg(svg);
      if (themed) {
        writeFileSync(path.join(PUBLIC, "logos", `${slug}-light.svg`), themed.light);
        writeFileSync(path.join(PUBLIC, "logos", `${slug}-dark.svg`), themed.dark);
        logoManifest[slug] = {
          light: `/logos/${slug}-light.svg`,
          dark: `/logos/${slug}-dark.svg`,
        };
      } else {
        writeFileSync(path.join(PUBLIC, "logos", `${slug}.svg`), svg);
        logoManifest[slug] = { src: `/logos/${slug}.svg` };
      }
    } else {
      /* 96px covers the 28px slot at 3x without shipping a 1024px app icon. */
      await sharp(from)
        .resize(96, 96, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 92 })
        .toFile(path.join(PUBLIC, "logos", `${slug}.webp`));
      logoManifest[slug] = { src: `/logos/${slug}.webp` };
    }
  }
}
const logos = Object.keys(logoManifest).length;

/* The page needs to know which projects have a real mark and which are themed.
   Deriving that here rather than hand-maintaining a parallel list is the only
   way the two cannot drift — this file is generated, and committed alongside
   the images it describes. */
writeFileSync(
  path.resolve("src/data/logos.ts"),
  `/**
 * GENERATED by scripts/build-assets.mjs — do not edit by hand.
 * Run \`pnpm logos && pnpm assets\` to refresh.
 *
 * Every project mark that exists as a real asset. A \`light\`/\`dark\` pair means
 * the source carried a prefers-color-scheme rule and was split so the site's
 * own theme toggle drives it; \`src\` means one file serves both themes.
 *
 * Projects absent from this map fall back to the drawn glyph in marks.ts.
 */

export type Logo = { src: string } | { light: string; dark: string };

export const logos: Record<string, Logo> = ${JSON.stringify(logoManifest, null, 2)};

export const logoFor = (slug: string): Logo | null => logos[slug] ?? null;

export const isThemed = (logo: Logo): logo is { light: string; dark: string } =>
  "light" in logo;
`,
);

/* ------------------------------------------------------------------- stills */

/**
 * Crops are chosen by hand per capture: one legible region, not a whole page.
 * `out` is the path under public/.
 *
 * `theme: "dark"` grades onto the dark colourway instead. Aeperion ships its
 * own light/dark switcher, so it is captured both ways and the case study
 * swaps frames with this site's theme; grading a dark capture onto the light
 * ramp would wash it to mud, since that ramp maps black to near-black ink and
 * white to paper.
 */
const STILLS = [
  {
    src: "instagib",
    out: "projects/instagib-arena.webp",
    crop: { left: 0, top: 0, width: 2880, height: 1800 },
  },
  {
    src: "palhelm",
    out: "projects/palhelm.webp",
    crop: { left: 340, top: 1540, width: 2200, height: 1375 },
  },
  { src: "coup", out: "projects/coup.webp", crop: { left: 480, top: 180, width: 1920, height: 1200 } },
  {
    src: "imprimatur",
    out: "projects/imprimatur.webp",
    crop: { left: 114, top: 70, width: 2148, height: 1342 },
  },
  {
    src: "vitals",
    out: "projects/vitals.webp",
    crop: { left: 300, top: 260, width: 2200, height: 1375 },
  },
  {
    src: "startpage",
    out: "projects/startpage.webp",
    crop: { left: 340, top: 150, width: 2200, height: 1375 },
  },
  { src: "hatchdle", out: "projects/hatchdle.webp", crop: { left: 240, top: 0, width: 2400, height: 1500 } },
  { src: "aimperion", out: "projects/aimperion.webp", crop: { left: 0, top: 0, width: 2880, height: 1800 } },
  { src: "chudopoly", out: "projects/chudopoly.webp", crop: { left: 0, top: 0, width: 2880, height: 1800 } },
  /* Dark-theme captures of sites that have one; the peek swaps to them. */
  {
    src: "palhelm-dark",
    out: "projects/palhelm-dark.webp",
    crop: { left: 340, top: 1540, width: 2200, height: 1375 },
    theme: "dark",
  },
  { src: "chudopoly-dark", out: "projects/chudopoly-dark.webp", crop: { left: 0, top: 0, width: 2880, height: 1800 }, theme: "dark" },
  /*
   * Full-length pages for the client frames, which scroll on hover. `tall`
   * keeps the whole height instead of cropping to 16:10.
   */
  { src: "aeperion-tall", out: "clients/aeperion-scroll.webp", tall: true },
  { src: "aeperion-tall-dark", out: "clients/aeperion-scroll-dark.webp", tall: true, theme: "dark" },
  { src: "mouserank-tall", out: "clients/mouserank-scroll.webp", tall: true },
  { src: "mouserank-tall-dark", out: "clients/mouserank-scroll-dark.webp", tall: true, theme: "dark" },
  /* Drop a pre-redesign capture here and it grades with everything else. */
  {
    src: "aeperion-before",
    out: "clients/aeperion-before.webp",
    crop: { left: 0, top: 0, width: 2880, height: 1800 },
    optional: true,
  },
];

/* Map [0,255] onto the theme's darkest..lightest, per channel. Light runs
   ink -> paper; dark runs paper -> ink, because on dark stock the paper is the
   dark end and the ink is the bright one. */
const RAMPS = {
  light: { from: INK, slope: PAPER.map((p, i) => (p - INK[i]) / 255) },
  dark: { from: DARK_PAPER, slope: DARK_INK.map((v, i) => (v - DARK_PAPER[i]) / 255) },
};

let graded = 0;
for (const still of STILLS) {
  const file = path.join(STILLS_SRC, `${still.src}.png`);
  if (!existsSync(file)) continue;

  const ramp = RAMPS[still.theme ?? "light"];
  const base = sharp(file);
  await (still.tall ? base.resize({ width: 1280 }) : base.extract(still.crop).resize(1280, 800, { fit: "cover" }))
    /* Keep a trace of the product's own hue; drop the shout. */
    .modulate({ saturation: 0.62 })
    .linear(ramp.slope, ramp.from)
    .webp({ quality: 80 })
    .toFile(path.join(PUBLIC, still.out));
  graded += 1;
}

console.log(
  `assets: identity + og written to public/; ${logos} logo${logos === 1 ? "" : "s"} normalised` +
    (logos ? "" : " (run `pnpm logos` to fetch sources)") +
    `; ${graded} still${graded === 1 ? "" : "s"} graded` +
    (graded ? "" : " (run `pnpm stills` to capture sources)"),
);
