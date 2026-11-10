/**
 * Site-wide defaults for SEO and branding. Override per page through <Seo /> props.
 *
 * Canonical origin: `site` in astro.config.mjs (driven by the SITE_URL env var) is the
 * only place the domain is defined. Astro exposes it as `import.meta.env.SITE`, which
 * this module, the sitemap and robots.txt all derive from.
 */
const SITE_URL = (
  typeof import.meta.env.SITE === "string" && import.meta.env.SITE.length > 0
    ? import.meta.env.SITE
    : "https://leadergroup.example"
).replace(/\/$/, "");

export const site = {
  /** Absolute origin, no trailing slash. Comes from astro.config `site`. */
  url: SITE_URL,

  /** Brand name (og:site_name, JSON-LD Organization). */
  name: "Leader Group",

  /** Default <title>. ~50-60 chars. */
  title: "Leader Group | Autos usados revisados, sin vueltas",

  /** Default meta description. ~150-160 chars. */
  description:
    "Usados revisados, con papeles al día y precio claro desde el primer mensaje. Mira el stock de Leader Group y consulta por WhatsApp.",

  /** Optional shorter title/description for social cards. */
  ogTitle: undefined as string | undefined,
  ogDescription: undefined as string | undefined,

  /** Default social image (public/), 1200x630. */
  image: "/og.png",
  imageAlt: "Leader Group, autos usados seleccionados",
  imageWidth: 1200,
  imageHeight: 630,

  /** Open Graph locale. */
  locale: "es_AR",
  localeAlternates: [] as string[],

  /** Browser chrome color (mobile), matches the dark header. */
  themeColor: "#05070b",

  keywords: "",

  /** Optional X/Twitter handle without @. */
  twitter: undefined as string | undefined,

  /** Optional Organization contact e-mail for JSON-LD. */
  email: undefined as string | undefined,

  /** Optional Google Search Console verification token. */
  googleSiteVerification: undefined as string | undefined,
} as const;

export type SiteConfig = typeof site;
