import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import { site } from "./src/data/site";

/**
 * The canonical host comes from src/data/site.ts, so a domain move is a
 * one-line edit there. (If you deploy on GitHub Pages, public/CNAME is the
 * other place the hostname is written down — that one is a DNS target, not
 * site config.)
 */
export default defineConfig({
  site: site.url,
  integrations: [svelte(), sitemap()],
});
