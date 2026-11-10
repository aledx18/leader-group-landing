# Leader Group landing

Public marketing site for Leader Group, a used-vehicle dealer in Argentina. Static Astro site,
mobile first, SEO first: the home shows the whole (small) stock right after the hero and every
vehicle has its own indexable page at `/autos/<slug>/`.

- Astro 7 (static output), Tailwind CSS 4 (Vite plugin), TypeScript strict, `@/*` alias.
- Self-hosted fonts (Archivo + Inter), images optimized at build time with `astro:assets`.
- Stock fetched **at build time** from one endpoint; local fixture when it is not configured.
- No client framework; only two small inline scripts (mobile menu, photo gallery).

## Commands

| Command | What it does |
| --- | --- |
| `bun install` | Install dependencies. |
| `bun run dev` | Dev server at `http://localhost:4321`. |
| `bun run build` | Static build into `dist/`. |
| `bun run preview` | Serve the build locally. |
| `bun run test` | Unit tests (vitest): stock loader, slugs, prices, WhatsApp links, JSON-LD. |
| `bun run check` | `astro check` (types and templates). |
| `bun run format` / `bun run lint` | Biome formatter / linter (TS, JS, JSON). |

## Environment variables

Copy `.env.example` to `.env` for local work. On Vercel, set them in Project Settings,
Environment Variables. All of them are read at build time only.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SITE_URL` | before launch | Canonical origin, for example `https://leadergroup.com.ar`. Drives canonical URLs, Open Graph, JSON-LD, sitemap and robots.txt. When unset, a Vercel build uses the project's production URL (and logs a warning on production); anywhere else it falls back to the placeholder `https://leadergroup.example`. |
| `STOCK_API_URL` | no | Stock endpoint. Unset: the build uses `src/data/stock-fixture.ts`. Set and failing: the build fails on purpose. |
| `STOCK_API_KEY` | no | Sent as `apikey` and `Authorization: Bearer` headers (Supabase). |

`STOCK_API_URL` and `STOCK_API_KEY` are server-only secrets (`astro:env/server`); never add the
`PUBLIC_` prefix. The endpoint contract and the work pending on the Supabase side are in
[`docs/stock-endpoint.md`](docs/stock-endpoint.md).

## Placeholders to replace before launch

Every business value (WhatsApp number, phone, address, hours, social links, hero statistics,
testimonial, financing example) lives in `src/config/business.ts` and is marked
`TODO(real data)`. Search for `TODO(real data)` to find them all. The testimonial and the
statistics are shown as text only; no rating or review structured data is emitted.

Other assets: `public/og.png` (default social card), icons in `public/` (from the brand icon
set), fixture photos in `src/assets/fixture/` (generated placeholders, only used without an
endpoint).

## Project layout

```text
src/
  config/        site.ts (SEO defaults), business.ts (placeholder business data)
  data/          stock-fixture.ts (local stock)
  lib/stock/     loader (allowlist, validation, slugs), photo resolution, build-time getStock()
  lib/           price format, WhatsApp links, JSON-LD builders
  components/    Seo, Header, Footer, VehicleCard, VehicleGallery, home/ sections
  layouts/       Layout.astro
  pages/         index, autos/[slug], 404, robots.txt
tests/           vitest unit tests
docs/            stock-endpoint.md
```

## Deploy (Vercel)

The landing goes at the root domain; the private system keeps its subdomain.

1. Import the GitHub repository in Vercel. `vercel.json` sets bun, `bun run build` and `dist/`;
   no adapter is needed for a static site.
2. Set `SITE_URL` (once the domain is purchased) and, when the endpoint exists,
   `STOCK_API_URL` / `STOCK_API_KEY` for the Production environment.
3. Add the root domain (and `www`, redirected to the root) in Project Settings, Domains. The
   private system stays on its own subdomain and project.
4. After the first production deploy, submit `https://<domain>/sitemap-index.xml` in Google
   Search Console.

### Refreshing the stock

The stock is part of the static build, so a change in the stock needs a new deploy:

1. In Vercel, Project Settings, Git, Deploy Hooks, create a hook for the production branch.
2. Call it whenever the stock changes, from the private system (after publishing, editing or
   selling a vehicle) or manually:

   ```sh
   curl -X POST "https://api.vercel.com/v1/integrations/deploy/<hook-id>"
   ```

If the endpoint fails during that build, the deploy fails and the previous version stays live.
