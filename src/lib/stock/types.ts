/**
 * Public stock contract. These are the only fields the site ever reads or keeps.
 * See docs/stock-endpoint.md for the endpoint side of the contract.
 */
export interface Vehicle {
  /** Stable identifier from the source system (stringified). */
  id: string;
  /** URL segment, stable for a given name and id: `<slugified-name>-<id piece>`. */
  slug: string;
  /** Display name, for example "Toyota Corolla XEI 2.0". */
  name: string;
  /** Price in whole currency units, greater than zero. */
  price: number;
  /** ISO 4217 code in upper case, for example "USD" or "ARS". */
  currency: string;
  /** Ordered photo references; the first one is the cover. May be empty. */
  photos: string[];
}

/** Photo reference used by the local fixture; resolved to files in src/assets/fixture/. */
export const FIXTURE_PHOTO_PREFIX = "fixture:";
