/**
 * Client work. Deliberately not a repo card — commercial work gets a case
 * study with a role, a live link, before/after frames and process notes.
 *
 * House rule: no invented metrics. Every line here is either verifiable on the
 * live storefront or recorded in the project repo. Performance work is
 * described mechanically (what was removed, what was changed) because no
 * Lighthouse or analytics baseline was ever captured.
 */

export type Frame = {
  src: string;
  /**
   * Optional dark-theme capture of the same frame, graded onto the dark
   * colourway. Only set it when the captured site has its own light/dark
   * switcher — otherwise the frame is the same picture in both themes and a
   * second file is dead weight.
   */
  srcDark?: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type ClientCase = {
  slug: string;
  /** Client name. */
  name: string;
  /** Case title. */
  title: string;
  /** What you owned. Keep it accurate. */
  role: string;
  year: number;
  website: string;
  /** Two or three sentences: the problem, then what was built. */
  summary: string;
  stack: string[];
  /** A real capture of the shipped work. */
  image: Frame;
};

export const clients: ClientCase[] = [
  {
    slug: "aeperion",
    name: "Aeperion",
    title: "Aeperion storefront redesign",
    role: "Design and front-end build",
    year: 2026,
    website: "https://aeperion.com",
    summary:
      "Aeperion sells premium gaming mousepads and was running a stock Shopify theme with demo copy still on the flagship product. I rebuilt the storefront on a fork of Shopify's Horizon theme — custom sections, a real cart, and product storytelling.",
    stack: ["Shopify", "Liquid", "Vanilla JS", "CSS"],
    image: {
      src: "/clients/aeperion-after.webp",
      srcDark: "/clients/aeperion-after-dark.webp",
      alt: "The redesigned Aeperion storefront homepage",
      caption: "aeperion.com today",
      width: 1280,
      height: 800,
    },
  },
];

export const [aeperion] = clients;
