import { idToken, vehicleSlug } from "./slug";
import { FIXTURE_PHOTO_PREFIX, type Vehicle } from "./types";

export interface NormalizeOptions {
  /** Accept `fixture:<name>` photo references (local fixture only, never the endpoint). */
  allowFixturePhotos?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readId(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  return null;
}

function readPrice(value: unknown): number | null {
  const price =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(price) && price > 0 ? price : null;
}

function readCurrency(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : null;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function readPhotos(value: unknown, options: NormalizeOptions): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (photo): photo is string =>
      typeof photo === "string" &&
      (isHttpUrl(photo) ||
        (options.allowFixturePhotos === true && photo.startsWith(FIXTURE_PHOTO_PREFIX))),
  );
}

/**
 * Maps one raw record to the public contract (allowlist). Any field not in the contract
 * (cost, plate, client_id, ...) is never copied. Returns null for an invalid record.
 */
function normalizeRecord(raw: unknown, options: NormalizeOptions): Omit<Vehicle, "slug"> | null {
  if (!isRecord(raw)) return null;
  const id = readId(raw.id);
  const name = typeof raw.name === "string" ? raw.name.trim().replace(/\s+/g, " ") : "";
  const price = readPrice(raw.price);
  const currency = readCurrency(raw.currency);
  if (id === null || name === "" || price === null || currency === null) return null;
  return { id, name, price, currency, photos: readPhotos(raw.photos, options) };
}

/**
 * Validates an endpoint payload (a JSON array) and returns only valid vehicles,
 * in source order, with unique ids and unique slugs. Throws if the payload is not an array.
 */
export function normalizeStock(payload: unknown, options: NormalizeOptions = {}): Vehicle[] {
  if (!Array.isArray(payload)) {
    throw new TypeError("Stock payload must be a JSON array of vehicles.");
  }

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const vehicles: Vehicle[] = [];

  for (const raw of payload) {
    const record = normalizeRecord(raw, options);
    if (record === null || seenIds.has(record.id)) continue;
    seenIds.add(record.id);

    let slug = vehicleSlug(record.name, record.id);
    if (seenSlugs.has(slug)) slug = vehicleSlug(record.name, record.id, idToken(record.id).length);
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    vehicles.push({
      id: record.id,
      slug,
      name: record.name,
      price: record.price,
      currency: record.currency,
      photos: record.photos,
    });
  }

  return vehicles;
}
