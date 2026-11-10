import { STOCK_API_KEY, STOCK_API_URL } from "astro:env/server";
import { stockFixture } from "@/data/stock-fixture";
import { loadStock, type StockResult } from "./loader";

export type { Vehicle } from "./types";

let cached: Promise<StockResult> | undefined;

/**
 * Build-time stock, fetched once per build and shared by every page.
 * Reads the server-only STOCK_API_URL / STOCK_API_KEY (never exposed to the client).
 */
export function getStock(): Promise<StockResult> {
  cached ??= loadStock({ url: STOCK_API_URL, apiKey: STOCK_API_KEY, fixture: stockFixture }).then(
    (result) => {
      const note = result.skipped > 0 ? `, ${result.skipped} invalid record(s) skipped` : "";
      console.info(`[stock] ${result.vehicles.length} vehicle(s) from ${result.source}${note}`);
      return result;
    },
  );
  return cached;
}
