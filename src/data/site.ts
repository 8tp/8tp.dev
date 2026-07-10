export const site = {
  url: "https://8tp.dev",
  title: "8tp.dev",
  tagline: "premium software, engineered from the basement",
  description:
    "Indie developer portfolio by Hunter (8tp). Browser games, web apps, terminal tools, and macOS utilities.",
  author: {
    name: "Hunter M.",
    handle: "8tp",
    pronouns: "he/him",
    location: "USA",
  },
  socials: [
    { label: "GitHub", url: "https://github.com/8tp", id: "github" },
  ],
  /**
   * Tech stack — mirrors the legacy "Tools of the trade" grid.
   * Grouped the trafficlunar way (editors / languages / frameworks / infra)
   * but the *content* is whatever Hunter actually ships with.
   */
  tools: {
    editors: ["Neovim", "Cursor", "Xcode", "kitty"],
    languages: ["TypeScript", "Rust", "Go", "Swift"],
    frameworks: ["React", "Next.js", "Tailwind", "Astro", "Ratatui", "SwiftUI"],
    infra: ["Node.js", "PostgreSQL", "Docker", "Cloudflare", "macOS"],
  },
};
