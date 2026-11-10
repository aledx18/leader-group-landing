# Stock endpoint

The site reads the vehicle stock **once, at build time**, from a single HTTP endpoint.
Nothing in this repository creates or changes anything in Supabase; this document
describes what the endpoint must return and what has to be built on the Supabase side.

## Configuration

| Variable | Required | Notes |
| --- | --- | --- |
| `STOCK_API_URL` | no | Full URL of the endpoint. Unset: the build uses the local fixture (`src/data/stock-fixture.ts`). |
| `STOCK_API_KEY` | no | Sent as `apikey: <key>` and `Authorization: Bearer <key>`, which is what Supabase REST/RPC expects. |

Both are **server-only** (`astro:env/server`, `access: "secret"`). Never rename them with the
`PUBLIC_` prefix: they are only read during the build and never shipped to the browser.

Behaviour (see `src/lib/stock/loader.ts`):

- `STOCK_API_URL` unset or blank: the fixture is used.
- `STOCK_API_URL` set and the request fails (network error, non-2xx status, invalid JSON, body
  that is not an array): **the build fails**. The site never publishes an empty or stale stock
  silently; the previous deployment stays live.
- `STOCK_API_URL` set and the endpoint returns `[]`: the site builds with an empty stock and
  shows the "no vehicles" state that invites contact by WhatsApp.

## JSON contract

`GET <STOCK_API_URL>` with `Accept: application/json` must return a JSON **array**:

```json
[
  {
    "id": "7c1e2a90-4b1d-4f7a-9a51-0d6e3c2b9f11",
    "name": "Toyota Corolla XEI 2.0",
    "price": 18900,
    "currency": "USD",
    "photos": [
      "https://<project>.supabase.co/storage/v1/object/sign/vehicle-photos/7c1e.../1.jpg?token=...",
      "https://<project>.supabase.co/storage/v1/object/sign/vehicle-photos/7c1e.../2.jpg?token=..."
    ]
  }
]
```

| Field | Type | Rule |
| --- | --- | --- |
| `id` | string or number | Required, non-empty. Stable over time: it is part of the vehicle URL. |
| `name` | string | Required, non-empty. Shown as the title of the card and the page. |
| `price` | number (or numeric string) | Required, greater than zero, whole units. |
| `currency` | string | Required ISO 4217 code (`USD`, `ARS`, ...). `USD` renders as `US$`, `ARS` as `$`. |
| `photos` | string[] | Optional. Ordered `http(s)` URLs; the **first is the cover**. Empty list shows a placeholder. |

The loader is an **allowlist**: only these five fields are kept. Anything else the endpoint
returns is dropped before it reaches a page, and records that break a rule are skipped (the
build log reports how many). Duplicated ids keep the first record.

Vehicle pages live at `/autos/<slug>/`, where the slug is the slugified name plus the first six
url-safe characters of the id (for example `toyota-corolla-xei-2-0-7c1e2a`). Renaming a vehicle
changes its URL, so keep names stable once published.

### Photos

Photos are downloaded and optimized by `astro:assets` during the build, so short-lived
**signed URLs are fine** as long as they are valid for the duration of the build (10 minutes is
plenty). Allowed hosts: `*.supabase.co` and the host of `STOCK_API_URL`
(`image.remotePatterns` in `astro.config.mjs`). Add a pattern there if photos come from another
host.

## What has to be built in Supabase (later)

Facts from the private system (read only):

- `public.vehicles` contains sensitive columns: `cost`, `plate`, `client_id`.
- The `anon` role has **no grants** on it.
- The `vehicle-photos` storage bucket is **private**.

So the endpoint must not be a plain PostgREST read of `public.vehicles`. Build **one** of these,
exposing only the contract fields for vehicles with `status = 'for_sale'`:

1. **Edge function** (recommended): runs with the service role inside Supabase, selects
   `id, name, price, currency` for `status = 'for_sale'`, creates signed URLs for each vehicle's
   photos in `vehicle-photos` (ordered, cover first), and returns the array above. Protect it with
   a shared secret passed as `STOCK_API_KEY` or keep it read-only and public; it never returns
   other columns.
2. **`SECURITY DEFINER` RPC** (`public.public_stock()`), owned by a role that can read the table,
   returning `setof` a composite with only the contract fields, `grant execute` to `anon` only on
   that function. Photo URLs must still be readable by the build: either signed URLs produced by
   an edge function, or a separate **public** bucket holding only published photos.
3. **Dedicated view** in a separate schema with only the contract columns and
   `where status = 'for_sale'`, with `security_invoker = false` and a grant to `anon` on the view
   only. Same constraint on photo URLs as the RPC.

Whichever is chosen:

- Never grant `anon` anything on `public.vehicles` itself.
- Never include `cost`, `plate`, `client_id` or any other internal column in the response, even
  though the site would drop them: the endpoint is reachable by anyone who has its URL and key.
- Keep the ordering of `photos` meaningful (cover first).

## Refreshing the site when the stock changes

The stock is baked into the static build. To publish changes, trigger a new Vercel deployment
through a **Deploy Hook** (Vercel project, Settings, Git, Deploy Hooks). The private system can
call that hook URL after a vehicle is published, sold or edited (for example from a database
webhook or the edge function), or someone can call it manually:

```sh
curl -X POST "https://api.vercel.com/v1/integrations/deploy/<hook-id>"
```
