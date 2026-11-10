// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

/**
 * Canonical origin. Single source of truth for canonical URLs, Open Graph,
 * JSON-LD, sitemap and robots.txt. Set SITE_URL in the environment (Vercel)
 * once the domain is purchased; the default is a placeholder.
 */
const SITE_URL = env.SITE_URL || "https://leadergroup.example";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
