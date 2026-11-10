import { normalizeStock } from "./normalize";
import type { Vehicle } from "./types";

export interface LoadStockOptions {
  /** Endpoint URL (STOCK_API_URL). When unset or blank the fixture is used. */
  url: string | undefined;
  /** Optional key (STOCK_API_KEY), sent as `apikey` and `Authorization: Bearer`. */
  apiKey?: string | undefined;
  /** Raw fixture records used when no url is configured. */
  fixture: unknown;
  /** Injected fetch (tests); defaults to the global fetch. */
  fetch?: typeof globalThis.fetch;
}

export interface StockResult {
  vehicles: Vehicle[];
  source: "endpoint" | "fixture";
  /** Number of raw records dropped as invalid or duplicated. */
  skipped: number;
}

/**
 * Loads the stock at build time.
 * - No url: local fixture (development, previews before the endpoint exists).
 * - Url set: fetch it; any network error, non-2xx status or non-array body throws,
 *   so the build fails instead of publishing an empty or stale stock.
 */
export async function loadStock(options: LoadStockOptions): Promise<StockResult> {
  const url = options.url?.trim();

  if (!url) {
    const vehicles = normalizeStock(options.fixture, { allowFixturePhotos: true });
    return { vehicles, source: "fixture", skipped: countSkipped(options.fixture, vehicles) };
  }

  const doFetch = options.fetch ?? globalThis.fetch;
  const headers = new Headers({ Accept: "application/json" });
  const apiKey = options.apiKey?.trim();
  if (apiKey) {
    headers.set("apikey", apiKey);
    headers.set("Authorization", `Bearer ${apiKey}`);
  }

  const endpoint = describeEndpoint(url);
  let response: Response;
  try {
    response = await doFetch(url, { headers });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Stock request to ${endpoint} failed: ${reason}`);
  }

  if (!response.ok) {
    throw new Error(`Stock request to ${endpoint} failed with HTTP ${response.status}.`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Stock response from ${endpoint} is not valid JSON.`);
  }

  const vehicles = normalizeStock(payload);
  return { vehicles, source: "endpoint", skipped: countSkipped(payload, vehicles) };
}

function countSkipped(payload: unknown, vehicles: Vehicle[]): number {
  return Array.isArray(payload) ? payload.length - vehicles.length : 0;
}

/** Origin and path only, so query strings with tokens never reach logs. */
function describeEndpoint(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return "the configured STOCK_API_URL";
  }
}
