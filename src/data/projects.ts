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
  /** Tokyo Night accent — also passed to gpt-image-1 in the codex prompt. */
  accent: Accent;
  source?: string;
  website?: string;
  thumbnail?: string;
  /** Tech stack pills — keep to 3-4 max for visual balance. */
  stack: string[];
  /** Marks the project as "live" — shown with a pulsing dot. */
  live?: boolean;
  /** Show prominently in the featured row at the top of the grid. */
  featured?: boolean;
  /** Single full-width spotlight at the very top of the grid. */
  spotlight?: boolean;
};

export const projects: Project[] = [
  {
    slug: "instagib-arena",
    name: "Instagib Arena",
    year: 2026,
    description:
      "Quake-style instagib FPS in the browser. One-shot railgun, strafe-jump movement, server-authoritative 64 Hz binary netcode with lag compensation, ranked duels, weekly replays, bots. Free, no download.",
    accent: "cyan",
    source: "https://github.com/8tp/instagib-arena",
    website: "https://instagib.win",
    thumbnail: "/projects/instagib-arena-bw.webp",
    stack: ["Three.js", "React 19", "Node/ws", "SQLite"],
    live: true,
    spotlight: true,
  },
  {
    slug: "antmaze",
    name: "AntMaze",
    year: 2026,
    description:
      "Perpetual-motion maze game where the ant never stops moving. Procedurally generated 7×7 → 21×21 mazes, LBP-inspired Web Audio soundtrack, ~10 KB gzipped.",
    accent: "yellow",
    source: "https://github.com/8tp/AntMaze",
    website: "https://ant.8tp.dev",
    thumbnail: "/projects/antmaze-bw.webp",
    stack: ["TypeScript", "Vite", "Canvas 2D", "Web Audio"],
    live: true,
    featured: true,
  },
  {
    slug: "hudaim",
    name: "HudAim",
    year: 2026,
    description:
      "Browser-based aim trainer with 6 game modes, 60 FPS replay system, LAN leaderboards and HMAC-SHA256 anti-cheat.",
    accent: "cyan",
    source: "https://github.com/8tp/hudaim",
    website: "https://aim.8tp.dev",
    thumbnail: "/projects/hudaim-bw.webp",
    stack: ["React 19", "Tailwind", "Node/Express", "IndexedDB"],
    live: true,
    featured: true,
  },
  {
    slug: "coup",
    name: "Coup",
    year: 2026,
    description:
      "Real-time multiplayer bluffing card game. Bots, room codes, mobile-friendly. No install, no accounts.",
    accent: "green",
    source: "https://github.com/8tp/Coup",
    website: "https://coup.8tp.dev",
    thumbnail: "/projects/coup-bw.webp",
    stack: ["Next.js", "TypeScript", "Socket.io", "Zustand"],
    live: true,
    featured: true,
  },
  {
    slug: "typeduel",
    name: "TypeDuel",
    year: 2026,
    description:
      "Real-time multiplayer typing combat. Type fast, deal damage, use abilities, defeat your opponent.",
    accent: "red",
    source: "https://github.com/8tp/typeduel",
    website: "https://duel.8tp.dev",
    thumbnail: "/projects/typeduel-bw.webp",
    stack: ["TypeScript", "React", "WebSocket", "Zustand"],
    live: true,
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
      "GitHub contribution visualizer in the terminal, with heatmaps, streak stats, language breakdowns, and 6 themes.",
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
      "Visual network topology mapper and scanner. Discover devices, scan ports, measure latency.",
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
      "Lightweight macOS menu bar app for real-time CPU, RAM, storage, battery, and temperature.",
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
      "Native macOS screenshot & annotation app. Area / window / scrolling capture, screen recording, OCR, GIF export.",
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

export const spotlight = projects.find((p) => p.spotlight);
export const featured = projects.filter((p) => p.featured);
export const rest = projects.filter((p) => !p.featured && !p.spotlight);
// `projects` itself is what the page renders now — kept ordered with live
// projects at the top via the array literal above.

/** Hex map — kept in lockstep with the @theme tokens in src/styles/global.css. */
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
