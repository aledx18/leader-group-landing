// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

/**
 * Canonical origin. Single source of truth for canonical URLs, Open Graph,
 * JSON-LD, sitemap and robots.txt. Set SITE_URL in the environment (Vercel)
 * once the domain is purchased. Until then a Vercel build uses the project's
 * production URL, and anything else falls back to a placeholder.
 */
const SITE_URL =
  env.SITE_URL ||
  (env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://leadergroup.example");
if (!env.SITE_URL && env.VERCEL_ENV === "production") {
  console.warn(`[site] SITE_URL is not set; canonical URLs use ${SITE_URL}.`);
}

/**
 * Remote photo hosts astro:assets may download and optimize at build time:
 * the stock endpoint's own host plus any Supabase project (storage URLs).
 */
const remotePatterns = [{ protocol: "https", hostname: "**.supabase.co" }];
if (env.STOCK_API_URL) {
  try {
    const { protocol, hostname } = new URL(env.STOCK_API_URL);
    remotePatterns.push({ protocol: protocol.replace(":", ""), hostname });
  } catch {
    // Invalid URL: astro:env validation reports it with a clear message.
  }
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  image: {
    remotePatterns,
  },
  env: {
    schema: {
      STOCK_API_URL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        url: true,
      }),
      STOCK_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
