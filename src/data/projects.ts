/**
 * Own projects, in two tiers. Featured entries get a ledger row with a blurb;
 * "also" entries get a name and a few words in one closing sentence.
 *
 * `preview` is opt-in and only ever points at a real capture of the running
 * product. Desktop hover/focus reveals it. If a project has no capture,
 * leave `preview` off; never substitute generated artwork for a screenshot.
 *
 * Copy rules live in docs/redesign-v3/research/writing.md: two sentences at
 * most, real numbers only, no em dashes.
 */

export type Tier = "featured" | "child" | "also";

export type Preview = {
  /** WebP still, 1280x800 source, rendered at ~320px wide. */
  src: string;
  /** The site's own dark theme, shown when this site is in dark mode. */
  srcDark?: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  /** Stable slug; also the preview filename: `/projects/<slug>.webp` */
  slug: string;
  name: string;
  tier: Tier;
  /** Featured: one or two sentences. Also: a short noun phrase. */
  blurb: string;
  /** Printed under the blurb with logos; names must match src/data/stack.ts. */
  stack?: string[];
  website?: string;
  /** Label for the website link. Games say "Play", everything else "Visit". */
  verb?: "Play" | "Visit" | "Docs";
  source?: string;
  /** YouTube video id. Renders a "Trailer" button that plays it in a dialog. */
  trailer?: string;
  preview?: Preview;
  /** Slug of the project this one belongs to; rendered under its parent. */
  parent?: string;
};

const still = (slug: string, alt: string, { dark = false } = {}): Preview => ({
  src: `/projects/${slug}.webp`,
  srcDark: dark ? `/projects/${slug}-dark.webp` : undefined,
  alt,
  width: 1280,
  height: 800,
});

export const projects: Project[] = [
  /* ----------------------------------------------------------------- featured */
  {
    slug: "instagib-arena",
    name: "Instagib Arena",
    tier: "featured",
    blurb:
      "A fast arena shooter in the style of Quake that runs in your browser, where one hit is a kill. Jump into a match as a guest, play ranked duels, or practise against bots.",
    stack: ["TypeScript", "React", "Three.js", "Node.js", "SQLite"],
    website: "https://instagib.win",
    verb: "Play",
    source: "https://github.com/8tp/instagib-arena",
    preview: still("instagib-arena", "The Instagib Arena main menu"),
  },
  {
    slug: "palhelm",
    name: "Palhelm",
    tier: "featured",
    blurb:
      "A control panel for people who run their own Palworld server. See who's online and what they've caught, browse the world map, run admin commands and schedule backups, all from a browser.",
    stack: ["Go", "Svelte", "TypeScript", "Docker"],
    website: "https://palhelm.com",
    source: "https://github.com/8tp/palhelm",
    preview: still("palhelm", "The Palhelm control panel showing server status, players and Pal data", { dark: true }),
  },
  {
    slug: "palhelm-bot",
    name: "Palhelm Bot",
    tier: "child",
    parent: "palhelm",
    blurb:
      "Brings Palhelm into Discord: server updates in your channel, and commands for looking up players, guilds and breeding.",
    stack: ["TypeScript", "discord.js"],
    website: "https://docs.palhelm.com",
    verb: "Docs",
    source: "https://github.com/8tp/palhelm-bot",
  },
  {
    slug: "hatchdle",
    name: "Hatchdle",
    tier: "featured",
    blurb:
      "A daily game with one egg a day. Tap it to see what hatches, collect all 36 creatures, keep your streak going and chase the rare ones.",
    stack: ["TypeScript", "Preact", "GSAP", "Cloudflare"],
    website: "https://hatchdle.com",
    verb: "Play",
    preview: still("hatchdle", "Today's egg on Hatchdle, with the odds for each rarity"),
  },
  {
    slug: "imprimatur",
    name: "Imprimatur",
    tier: "featured",
    blurb:
      "A Mac app for filling in PDF forms, including the government forms most Mac apps can't open. It also handles markup and signatures, and your files never get uploaded anywhere.",
    stack: ["Rust", "Swift"],
    source: "https://github.com/8tp/imprimatur",
    preview: still("imprimatur", "Imprimatur filling a ten-page dynamic XFA immigration form"),
  },
  {
    slug: "coup",
    name: "Coup",
    tier: "featured",
    blurb:
      "The bluffing card game Coup, in your browser. Share a code with friends and play on any device, with bots to fill empty seats and nothing to download.",
    stack: ["TypeScript", "Next.js", "React", "Socket.IO"],
    website: "https://coup.8tp.dev",
    verb: "Play",
    source: "https://github.com/8tp/Coup",
    preview: still("coup", "The first page of Coup's tutorial"),
  },
  {
    slug: "chudopoly",
    name: "Chudopoly",
    tier: "featured",
    blurb:
      "Monopoly Deal with an Air Force theme, for two to five players. Share a room code, play from a phone or a laptop, and a bot takes over if someone leaves.",
    stack: ["JavaScript", "Node.js", "Express"],
    website: "https://chudopoly.deal",
    verb: "Play",
    source: "https://github.com/8tp/chudopoly",
    preview: still("chudopoly", "The Chudopoly home screen with a fanned deck of cards", { dark: true }),
  },

  /* --------------------------------------------------------------------- also */
  {
    slug: "screencap",
    name: "ScreenCap",
    tier: "also",
    blurb: "a Mac screenshot and annotation app",
    source: "https://github.com/8tp/ScreenCap",
  },
  {
    slug: "startpage",
    name: "startpage",
    tier: "also",
    blurb: "the browser start page this site's look came from",
    source: "https://github.com/8tp/startpage",
  },
  {
    slug: "vitals",
    name: "Vitals",
    tier: "also",
    blurb: "a self-hosted health dashboard",
    website: "https://vitals.8tp.dev",
    source: "https://github.com/8tp/Vitals-Command-Center",
  },
];

const byTier = (tier: Tier) => projects.filter((p) => p.tier === tier);

export const featured = byTier("featured");
export const also = byTier("also");

/** Sub-projects rendered under their parent's row. */
export const childrenOf = (slug: string) => projects.filter((p) => p.parent === slug);

/** The "everything else" escape hatch. */
export const allReposUrl = "https://github.com/8tp";
