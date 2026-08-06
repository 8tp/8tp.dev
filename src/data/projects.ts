/**
 * Project data, two tiers. Featured entries get a blurb and a stack line;
 * "more" entries get a name and one sentence.
 *
 * `preview` is opt-in and only ever points at a real capture of the running
 * product — desktop hover/focus reveals it. If a project has no capture,
 * leave `preview` off; never substitute generated artwork for a screenshot.
 */

export type Tier = "featured" | "child" | "more";

export type Preview = {
  /** WebP still, 1280x800 source, rendered at ~320px wide. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  /** Stable slug; also the preview filename: `/projects/<slug>.webp` */
  slug: string;
  name: string;
  tier: Tier;
  /** One or two sentences. No spec dumps. */
  blurb: string;
  /** Three or four entries, featured tier only. */
  stack?: string[];
  website?: string;
  source?: string;
  preview?: Preview;
  /** Slug of the project this one belongs to; rendered inside its parent. */
  parent?: string;
};

export const projects: Project[] = [
  /* ----------------------------------------------------------------- featured */
  {
    slug: "instagib-arena",
    name: "Instagib Arena",
    tier: "featured",
    blurb:
      "Quake-style instagib FPS that runs in a browser tab — one-shot railgun, strafe-jump movement, and server-authoritative netcode with client prediction and lag compensation, so a hit registers where you saw it.",
    stack: ["Three.js", "React", "Node/ws", "SQLite"],
    website: "https://instagib.win",
    source: "https://github.com/8tp/instagib-arena",
    preview: {
      src: "/projects/instagib-arena.webp",
      alt: "Instagib Arena running in the browser",
      width: 1280,
      height: 800,
    },
  },
  {
    slug: "palhelm",
    name: "Palhelm",
    tier: "featured",
    blurb:
      "Self-hosted control panel for Palworld servers, shipped as one Docker container — live dashboard, players and Pals parsed straight from the save file, a world map, an RCON console, and scheduled backups.",
    stack: ["Go", "Svelte", "Docker", "RCON"],
    website: "https://palhelm.com",
    source: "https://github.com/8tp/palhelm",
    preview: {
      src: "/projects/palhelm.webp",
      alt: "The Palhelm control panel showing server status, players and Pal data",
      width: 1280,
      height: 800,
    },
  },
  {
    slug: "palhelm-bot",
    name: "Palhelm Bot",
    tier: "child",
    parent: "palhelm",
    blurb:
      "Discord companion: live server events, plus 30+ slash commands for players, guilds, Pal ownership, breeding and records.",
    stack: ["TypeScript", "discord.js"],
    website: "https://docs.palhelm.com",
    source: "https://github.com/8tp/palhelm-bot",
  },
  {
    slug: "imprimatur",
    name: "Imprimatur",
    tier: "featured",
    blurb:
      "Native, local-first PDF workspace for macOS that opens the forms other Mac apps can't — AcroForms and dynamic Adobe LiveCycle/XFA. Reading, filling, markup, signing and conversion in one app, and documents never leave the Mac.",
    stack: ["Rust", "Swift", "XFA"],
    source: "https://github.com/8tp/imprimatur",
    preview: {
      src: "/projects/imprimatur.webp",
      alt: "Imprimatur filling a ten-page dynamic XFA immigration form",
      width: 1280,
      height: 800,
    },
  },
  {
    slug: "coup",
    name: "Coup",
    tier: "featured",
    blurb:
      "Real-time multiplayer bluffing card game. Share a room code and play on any device — bots fill the empty seats, and nobody needs an install or an account.",
    stack: ["Next.js", "Socket.io", "Zustand"],
    website: "https://coup.8tp.dev",
    source: "https://github.com/8tp/Coup",
    preview: {
      src: "/projects/coup.webp",
      alt: "A Coup game table in the browser",
      width: 1280,
      height: 800,
    },
  },
  {
    slug: "startpage",
    name: "startpage",
    tier: "featured",
    blurb:
      "Paper-and-ink browser start page that runs straight from file:// with no build step — search bangs, clock and weather, link groups, and a drifting dither shader. This site's design system grew out of it.",
    stack: ["HTML", "CSS", "JavaScript"],
    source: "https://github.com/8tp/startpage",
    preview: {
      src: "/projects/startpage.webp",
      alt: "The startpage: clock, search field and link groups on dithered paper",
      width: 1280,
      height: 800,
    },
  },
  {
    slug: "screencap",
    name: "ScreenCap",
    tier: "featured",
    blurb:
      "Native macOS capture and annotation app — area, window and scrolling capture, screen recording, on-image OCR via Vision, and GIF export. SwiftUI and AppKit, no Electron.",
    stack: ["Swift", "SwiftUI", "Vision"],
    source: "https://github.com/8tp/ScreenCap",
  },
  {
    slug: "vitals",
    name: "Vitals",
    tier: "featured",
    blurb:
      "Self-hosted health dashboard that merges Fitbit, Oura, WHOOP, Apple Health, Strava and Garmin into one daily readiness read. Everything stays in a local SQLite file.",
    stack: ["TypeScript", "Fastify", "React", "SQLite"],
    website: "https://vitals.8tp.dev",
    source: "https://github.com/8tp/Vitals-Command-Center",
    preview: {
      src: "/projects/vitals.webp",
      alt: "The Vitals dashboard showing readiness and recovery metrics",
      width: 1280,
      height: 800,
    },
  },

  /* --------------------------------------------------------------------- more */
  {
    slug: "typeduel",
    name: "TypeDuel",
    tier: "more",
    blurb: "Real-time typing combat over WebSocket — accurate typing lands damage.",
    website: "https://duel.8tp.dev",
    source: "https://github.com/8tp/typeduel",
    preview: {
      src: "/projects/typeduel.webp",
      alt: "A TypeDuel match in progress",
      width: 1280,
      height: 800,
    },
  },
  {
    slug: "hudaim",
    name: "HudAim",
    tier: "more",
    blurb: "Browser aim trainer with six modes, replays and leaderboards.",
    website: "https://aim.8tp.dev",
    source: "https://github.com/8tp/hudaim",
    preview: {
      src: "/projects/hudaim.webp",
      alt: "A HudAim training session with targets on the grid",
      width: 1280,
      height: 800,
    },
  },
  {
    slug: "netmap",
    name: "netmap",
    tier: "more",
    blurb: "Terminal network mapper: discovers devices, scans ports, measures latency.",
    source: "https://github.com/8tp/netmap",
  },
  {
    slug: "tidewatcher",
    name: "TideWatcher",
    tier: "more",
    blurb: "System monitor TUI with live charts and theme-aware ASCII scenes.",
    source: "https://github.com/8tp/tidewatcher",
  },
  {
    slug: "litestats",
    name: "LiteStats",
    tier: "more",
    blurb: "macOS menu bar monitor for CPU, memory, storage and battery.",
    source: "https://github.com/8tp/LiteStats",
  },
  {
    slug: "recopy",
    name: "Recopy",
    tier: "more",
    blurb: "macOS menu bar clipboard manager. Fully offline, no dependencies.",
    source: "https://github.com/8tp/Recopy",
  },
  {
    slug: "antmaze",
    name: "AntMaze",
    tier: "more",
    blurb: "A maze game where the ant never stops moving. 10 KB gzipped.",
    website: "https://ant.8tp.dev",
    source: "https://github.com/8tp/AntMaze",
  },
  {
    slug: "wc26-bracket",
    name: "wc26-bracket",
    tier: "more",
    blurb: "The 2026 World Cup drawn as a metro map — every match a station.",
    source: "https://github.com/8tp/wc26-bracket",
  },
];

const byTier = (tier: Tier) => projects.filter((p) => p.tier === tier);

export const featured = byTier("featured");
export const more = byTier("more");

/** Sub-projects rendered inside their parent's block. */
export const childrenOf = (slug: string) => projects.filter((p) => p.parent === slug);

/** The "everything else" escape hatch. */
export const allReposUrl = "https://github.com/8tp";
