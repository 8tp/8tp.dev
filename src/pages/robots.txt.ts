import type { APIRoute } from "astro";
import { site } from "~/data/site";

/** Prerendered to dist/robots.txt, so the sitemap URL follows a domain change. */
export const GET: APIRoute = () =>
  new Response(
    ["User-agent: *", "Allow: /", "", `Sitemap: ${new URL("sitemap-index.xml", site.url).href}`, ""].join(
      "\n",
    ),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
