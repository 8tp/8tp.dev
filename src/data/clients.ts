/**
 * Client work. Deliberately not a repo card: commercial work gets a short case
 * with a role, a live link, a real capture and a plain account of the work.
 *
 * House rules:
 * - No invented metrics. Every line is either checkable on the live site or
 *   recorded in the project repo. With no baseline, describe the work
 *   mechanically: what was built, removed or changed.
 * - The client's own brand lines are theirs. Don't quote them as copy here.
 * - MouseRank: no opinion, score or tier placement is ever attributed to
 *   boardzy (a rule from that repo's README).
 */

export type Frame = {
  src: string;
  /**
   * Optional dark-theme capture of the same frame, graded onto the dark
   * colourway. Only set it when the captured site has its own light/dark
   * switcher; otherwise the frame is the same picture in both themes and a
   * second file is dead weight.
   */
  srcDark?: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /**
   * The capture is a full-length page rather than one screen. The frame
   * shows the top and scrolls down through the rest on hover or focus.
   */
  scroll?: boolean;
};

export type ClientCase = {
  slug: string;
  /** Project name, as the client calls it. */
  name: string;
  /** Who it was for, when that isn't the project name itself. */
  client?: string;
  /** What you owned. Keep it accurate. */
  role: string;
  website: string;
  /** Short paragraphs: what was there, then what was built. */
  summary: string[];
  stack: string[];
  /** A real capture of the shipped work. */
  image: Frame;
  /** YouTube video id. Renders a "Trailer" button beside the site link. */
  trailer?: string;
  /** Slug of the case this one belongs to; rendered inside its parent. */
  parent?: string;
};

export const clients: ClientCase[] = [
  {
    slug: "aeperion",
    name: "Aeperion",
    role: "Storefront design and build",
    website: "https://aeperion.com",
    summary: [
      "Aeperion makes gaming mousepads. When I started, the store ran a free Shopify theme on its default settings, and the menu was Home, Discord and About us.",
      "I redesigned and rebuilt the store. It now has a page telling the story of their glass pad, a page explaining how the pads are made, a light and a dark mode, and a newsletter. I still work with them.",
    ],
    stack: ["Shopify", "Liquid", "JavaScript", "CSS"],
    image: {
      src: "/clients/aeperion-scroll.webp",
      srcDark: "/clients/aeperion-scroll-dark.webp",
      alt: "The redesigned Aeperion storefront homepage, from the hero down through the pad range",
      caption: "aeperion.com",
      width: 1280,
      height: 3200,
      scroll: true,
    },
  },
  {
    slug: "aimperion",
    name: "Aimperion",
    parent: "aeperion",
    role: "Design and build",
    website: "https://aimperion.com",
    summary: [
      "A free aim trainer for Aeperion's players that runs in the browser. It reads your mouse the way games do, so your settings carry over, and every score is checked before it goes on the leaderboard.",
    ],
    stack: ["JavaScript", "Three.js", "Better Auth"],
    image: {
      src: "/projects/aimperion.webp",
      alt: "An Aimperion scenario with its top five scores",
      caption: "aimperion.com",
      width: 1280,
      height: 800,
    },
  },
  {
    slug: "mouserank",
    name: "MouseRank",
    client: "for boardzy",
    role: "Design and build",
    website: "https://mouserank.org",
    summary: [
      "boardzy reviews gaming mice on YouTube, and MouseRank is his site. You drag mice into tiers and share the list as a link or an image.",
      "There's also a catalog of 344 mice with specs from each maker, a quiz that suggests mice for your hand size, side-by-side comparisons, and reviews from members.",
    ],
    stack: ["JavaScript", "Cloudflare", "Better Auth"],
    image: {
      src: "/clients/mouserank-scroll.webp",
      srcDark: "/clients/mouserank-scroll-dark.webp",
      alt: "The MouseRank tier list builder with the unranked pool of mice",
      caption: "mouserank.org",
      width: 1280,
      height: 1600,
      scroll: true,
    },
  },
];

/** Top-level cases, in page order. */
export const cases = clients.filter((c) => !c.parent);

/** Cases rendered inside their parent's block. */
export const casesUnder = (slug: string) => clients.filter((c) => c.parent === slug);
