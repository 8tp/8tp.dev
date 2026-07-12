export type Accent =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "mint"
  | "cyan"
  | "blue"
  | "magenta"
  | "purple";

export type Project = {
  /** Stable slug, also used for thumbnail filename: `/projects/<slug>.webp` */
  slug: string;
  name: string;
  year: number;
  /** Short, single-sentence description shown on the card. */
  description: string;
  /** Tokyo Night accent used by the generated thumbnail art. */
  accent: Accent;
  source?: string;
  website?: string;
  thumbnail?: string;
  /** Tech stack pills. Keep to 3-4 for visual balance. */
  stack: string[];
  /** Marks a project you can play or use live in the browser. */
  live?: boolean;
  /** Call to action label for the primary button (defaults per live/website). */
  cta?: string;
  /** Show in the featured row near the top of the grid. */
  featured?: boolean;
  /** Full-width spotlight at the very top of the grid. */
  spotlight?: boolean;
};

export const projects: Project[] = [
  {
    slug: "instagib-arena",
    name: "Instagib Arena",
    year: 2026,
    description:
      "Quake-style instagib FPS in the browser. One-shot railgun, strafe-jump movement, and server-authoritative 64 Hz binary netcode with lag compensation. Ranked duels, weekly replay challenges, and offline bots. Free, no download.",
    accent: "cyan",
    source: "https://github.com/8tp/instagib-arena",
    website: "https://instagib.win",
    thumbnail: "/projects/instagib-arena-bw.webp",
    stack: ["Three.js", "React 19", "Node/ws", "SQLite"],
    live: true,
    cta: "play",
    spotlight: true,
  },
  {
    slug: "palhelm",
    name: "Palhelm",
    year: 2026,
    description:
      "Self-hosted web admin panel for Palworld servers. One Docker image: a live dashboard, players and Pal data read straight from the save file, a world map, an RCON console, and safe scheduled backups with dry-run restores.",
    accent: "green",
    source: "https://github.com/8tp/palhelm",
    website: "https://palhelm.com",
    thumbnail: "/projects/palhelm-bw.webp",
    stack: ["Go", "Svelte", "Docker", "RCON"],
    cta: "visit",
    spotlight: true,
  },
  {
    slug: "palhelm-bot",
    name: "Palhelm Bot",
    year: 2026,
    description:
      "Discord companion for Palhelm. Posts live server events and answers 30+ slash commands for players, guilds, Pal ownership, breeding, and records, with rendered world-map and Pal images.",
    accent: "mint",
    source: "https://github.com/8tp/palhelm-bot",
    website: "https://docs.palhelm.com",
    thumbnail: "/projects/palhelm-bot-bw.webp",
    stack: ["TypeScript", "discord.js", "Node.js"],
    cta: "docs",
    featured: true,
  },
  {
    slug: "coup",
    name: "Coup",
    year: 2026,
    description:
      "Real-time multiplayer bluffing card game. Bots, room codes, and mobile-friendly play. No install, no accounts.",
    accent: "green",
    source: "https://github.com/8tp/Coup",
    website: "https://coup.8tp.dev",
    thumbnail: "/projects/coup-bw.webp",
    stack: ["Next.js", "TypeScript", "Socket.io", "Zustand"],
    live: true,
    featured: true,
  },
  {
    slug: "hudaim",
    name: "HudAim",
    year: 2026,
    description:
      "Browser aim trainer with 6 game modes, a 60 FPS replay system, LAN leaderboards, and HMAC-SHA256 anti-cheat.",
    accent: "cyan",
    source: "https://github.com/8tp/hudaim",
    website: "https://aim.8tp.dev",
    thumbnail: "/projects/hudaim-bw.webp",
    stack: ["React 19", "Tailwind", "Node/Express", "IndexedDB"],
    live: true,
    featured: true,
  },
  {
    slug: "antmaze",
    name: "AntMaze",
    year: 2026,
    description:
      "Perpetual-motion maze game where the ant never stops moving. Procedural 7x7 to 21x21 mazes, an LBP-inspired Web Audio soundtrack, and a tiny 10 KB gzipped payload.",
    accent: "yellow",
    source: "https://github.com/8tp/AntMaze",
    website: "https://ant.8tp.dev",
    thumbnail: "/projects/antmaze-bw.webp",
    stack: ["TypeScript", "Vite", "Canvas 2D", "Web Audio"],
    live: true,
    featured: true,
  },
  {
    slug: "typeduel",
    name: "TypeDuel",
    year: 2026,
    description:
      "Real-time multiplayer typing combat. Type fast, deal damage, trigger abilities, and win the duel in the browser.",
    accent: "red",
    source: "https://github.com/8tp/typeduel",
    website: "https://duel.8tp.dev",
    thumbnail: "/projects/typeduel-bw.webp",
    stack: ["TypeScript", "React", "WebSocket", "Zustand"],
    live: true,
    featured: true,
  },
  {
    slug: "tidewatcher",
    name: "TideWatcher",
    year: 2026,
    description:
      "System monitor TUI with tide-inspired live charts, process views, and theme-aware ASCII scenes.",
    accent: "orange",
    source: "https://github.com/8tp/tidewatcher",
    thumbnail: "/projects/tidewatcher-bw.webp",
    stack: ["Rust", "Ratatui"],
  },
  {
    slug: "ghgarden",
    name: "ghgarden",
    year: 2026,
    description:
      "GitHub contribution visualizer for the terminal, with heatmaps, streak stats, language breakdowns, and 6 themes.",
    accent: "mint",
    source: "https://github.com/8tp/ghgarden",
    thumbnail: "/projects/ghgarden-bw.webp",
    stack: ["Rust", "Ratatui"],
  },
  {
    slug: "netmap",
    name: "netmap",
    year: 2026,
    description:
      "Visual network topology mapper and scanner. Discover devices, scan ports, and measure latency from a terminal UI.",
    accent: "blue",
    source: "https://github.com/8tp/netmap",
    thumbnail: "/projects/netmap-bw.webp",
    stack: ["Go", "Bubble Tea"],
  },
  {
    slug: "litestats",
    name: "LiteStats",
    year: 2026,
    description:
      "Lightweight macOS menu bar monitor for CPU, RAM, storage, battery, and temperature.",
    accent: "magenta",
    source: "https://github.com/8tp/LiteStats",
    thumbnail: "/projects/litestats-bw.webp",
    stack: ["Swift", "SwiftUI", "IOKit"],
  },
  {
    slug: "screencap",
    name: "ScreenCap",
    year: 2026,
    description:
      "Native macOS screenshot and annotation app. Area, window, and scrolling capture, screen recording, OCR, and GIF export.",
    accent: "purple",
    source: "https://github.com/8tp/ScreenCap",
    thumbnail: "/projects/screencap-bw.webp",
    stack: ["Swift", "SwiftUI", "Vision"],
  },
  {
    slug: "recopy",
    name: "Recopy",
    year: 2026,
    description:
      "Native macOS menu bar clipboard manager. Zero dependencies, fully offline, built with SwiftData.",
    accent: "yellow",
    source: "https://github.com/8tp/Recopy",
    thumbnail: "/projects/recopy-bw.webp",
    stack: ["Swift", "SwiftUI", "SwiftData"],
  },
];

export const spotlights = projects.filter((p) => p.spotlight);
export const featured = projects.filter((p) => (p.featured || p.live) && !p.spotlight);
export const rest = projects.filter((p) => !p.featured && !p.live && !p.spotlight);

/** Hex map, kept in lockstep with the @theme tokens in src/styles/global.css. */
export const ACCENT_HEX: Record<Accent, string> = {
  red: "#f7768e",
  orange: "#ff9e64",
  yellow: "#e0af68",
  green: "#9ece6a",
  mint: "#73daca",
  cyan: "#7dcfff",
  blue: "#7aa2f7",
  magenta: "#bb9af7",
  purple: "#9d7cd8",
};
