/**
 * Tech names to their logos, from Simple Icons (CC0). Only the icons named
 * here end up in the build.
 *
 * A name with no icon still renders, as text only (Liquid has no mark in the
 * set). Each path is written into the page once, as a <symbol> in Sprite.astro,
 * and every logo after that is a <use> reference, so a stack that repeats
 * TypeScript five times doesn't ship its outline five times.
 *
 * Brand colours that would vanish on one of the two paper colours (pure black
 * for Three.js and Next.js, white for Better Auth) fall back to ink, so every
 * mark stays legible in both themes.
 */
import {
  siBetterauth,
  siCloudflare,
  siCss,
  siDiscorddotjs,
  siDocker,
  siExpress,
  siGithub,
  siGo,
  siGsap,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siPreact,
  siReact,
  siRust,
  siShopify,
  siSocketdotio,
  siSqlite,
  siSvelte,
  siSwift,
  siThreedotjs,
  siTypescript,
} from "simple-icons";

type SimpleIcon = { path: string; hex: string };

const icons: Record<string, SimpleIcon> = {
  "Better Auth": siBetterauth,
  Cloudflare: siCloudflare,
  CSS: siCss,
  "discord.js": siDiscorddotjs,
  Docker: siDocker,
  Express: siExpress,
  Go: siGo,
  GSAP: siGsap,
  JavaScript: siJavascript,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  Preact: siPreact,
  React: siReact,
  Rust: siRust,
  Shopify: siShopify,
  "Socket.IO": siSocketdotio,
  SQLite: siSqlite,
  Svelte: siSvelte,
  Swift: siSwift,
  "Three.js": siThreedotjs,
  TypeScript: siTypescript,
};

export type Tech = {
  name: string;
  /** Sprite symbol id, or null for text-only entries. */
  id: string | null;
  /** Brand colour when it reads on both papers; null means use ink. */
  color: string | null;
};

/** Relative luminance of a hex colour, 0 (black) to 1 (white). */
const luminance = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/* Too dark for the dark paper or too light for the light one. */
const legible = (hex: string) => {
  const l = luminance(hex);
  return l > 0.03 && l < 0.7;
};

const symbolId = (name: string) => `si-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export const tech = (names: string[] = []): Tech[] =>
  names.map((name) => {
    const icon = icons[name];
    return {
      name,
      id: icon ? symbolId(name) : null,
      color: icon && legible(icon.hex) ? `#${icon.hex}` : null,
    };
  });

/** Every symbol the sprite needs for these names, each once. */
export const symbolsFor = (names: string[]) =>
  [...new Set(names)].filter((n) => icons[n]).map((n) => ({ id: symbolId(n), path: icons[n].path }));

/** Interface glyphs, 24x24. GitHub is filled; mail is drawn with a stroke. */
export const glyphs = {
  github: siGithub.path,
  mail: "M4.5 6h15A1.5 1.5 0 0 1 21 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-9A1.5 1.5 0 0 1 4.5 6Zm-1 1.25L12 13l8.5-5.75",
};
