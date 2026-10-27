/**
 * The headline project: one piece of work shown above everything else, with a
 * first-person run playing and a strip of shorter clips under it. bunnyhop.lol
 * is one of my own projects, not client work.
 *
 * Same house rules as the rest of the data: real numbers only, every one of
 * them checkable on the live site, and no em dashes.
 *
 * The footage is real runs, not a mock-up: world records from the live
 * leaderboards, rendered in first person by the game's own MP4 exporter on
 * bunnyhop.lol with the Enhanced look (sun shadows, contact shading, bloom,
 * the bhop_ambience showcase lighting), 2x supersampled with motion blur, no
 * HUD. The script that drove it is a read-only cousin of the game repo's
 * tools/wr-videos. Re-encoded without audio for the page.
 */

/** A short first-person loop from another map. */
export type Clip = { src: string; poster: string; map: string; alt: string };

export type Headliner = {
  slug: string;
  name: string;
  /** One line under the name: what it is and where it runs. */
  meta: string;
  /** Short paragraphs. */
  summary: string[];
  stack: string[];
  links: { label: string; href: string }[];
  video: { src: string; poster: string; alt: string; caption: string; width: number; height: number };
  clips: Clip[];
};

export const headliner: Headliner = {
  slug: "bunnyhop",
  name: "bunnyhop.lol",
  meta: "Browser game, plus a desktop client for Windows, macOS and Linux",
  summary: [
    "Counter-Strike: Source bunnyhop in the browser, with Source movement at 100 tick and more than 600 of the classic bhop maps. There's nothing to install and you don't need an account.",
    "Your best run races you as a ghost on every attempt. Leaderboard runs are re-simulated on the server before they count, and any replay can be exported to MP4.",
  ],
  stack: ["Rust", "C++", "WebGL", "WebAssembly", "Cloudflare", "Electron"],
  links: [
    { label: "Play", href: "https://bunnyhop.lol" },
    { label: "Desktop client", href: "https://github.com/8tp/bunnyhop-client/releases/latest" },
  ],
  video: {
    src: "/bunnyhop/ambience.mp4",
    poster: "/bunnyhop/ambience-poster.webp",
    alt: "First-person run through bhop_ambience: hopping across white stone blocks over bright grass, under pink-blossom trees and a clear sky",
    caption: "bhop_ambience in first person: the world record by Dim (19.17 s), rendered in the game with its Enhanced look.",
    width: 1280,
    height: 720,
  },
  clips: [
    { src: "/bunnyhop/kz_ocean.mp4", poster: "/bunnyhop/kz_ocean.webp", map: "bhop_kz_ocean", alt: "First person: hopping between crates and sandbars on open sea, palm trees on the islands" },
    { src: "/bunnyhop/mist.mp4", poster: "/bunnyhop/mist.webp", map: "bhop_mist", alt: "First person: hopping across a rooftop course at sunset" },
    { src: "/bunnyhop/japan.mp4", poster: "/bunnyhop/japan.webp", map: "bhop_japan", alt: "First person: hopping across blue platforms past painted walls, with mountains beyond" },
    { src: "/bunnyhop/crash_egypt.mp4", poster: "/bunnyhop/crash_egypt.webp", map: "bhop_crash_egypt", alt: "First person: hopping through a hall of painted hieroglyphs, past glowing blue pools" },
  ],
};
