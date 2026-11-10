import type { APIRoute } from "astro";

/**
 * robots.txt derived from Astro `site` (astro.config.mjs).
 * Single source of truth with the sitemap and the Seo canonical/OG URLs.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = site
    ? new URL("sitemap-index.xml", site).href
    : "https://leadergroup.example/sitemap-index.xml";

  const body = [
    "# Generated from astro.config `site`. Change the domain only there (SITE_URL).",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${sitemap}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
