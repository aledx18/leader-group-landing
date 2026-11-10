import { describe, expect, it } from "vitest";
import { slugify, vehicleSlug } from "@/lib/stock/slug";

describe("slugify", () => {
  it("lowercases, strips accents and joins words with hyphens", () => {
    expect(slugify("Peugeot 208 Allure 1.6 Único Dueño")).toBe(
      "peugeot-208-allure-1-6-unico-dueno",
    );
  });

  it("trims leading and trailing separators and collapses symbols", () => {
    expect(slugify("  --Toyota  Corolla // XEI!! ")).toBe("toyota-corolla-xei");
  });

  it("falls back to 'auto' when nothing usable remains", () => {
    expect(slugify("¡¿?!")).toBe("auto");
  });
});

describe("vehicleSlug", () => {
  it("appends a short, stable piece of the id to the slugified name", () => {
    const id = "3f2a9c1e-7b44-4d2a-9e0f-1c2b3a4d5e6f";
    expect(vehicleSlug("Toyota Corolla XEI 2.0", id)).toBe("toyota-corolla-xei-2-0-3f2a9c");
    expect(vehicleSlug("Toyota Corolla XEI 2.0", id)).toBe(
      vehicleSlug("Toyota Corolla XEI 2.0", id),
    );
  });

  it("gives different slugs to vehicles with the same name and different ids", () => {
    expect(vehicleSlug("Fiat Cronos", "aaaaaa11")).not.toBe(vehicleSlug("Fiat Cronos", "bbbbbb22"));
  });

  it("keeps only url-safe characters from the id", () => {
    expect(vehicleSlug("Fiat Cronos", "ID_9:X")).toBe("fiat-cronos-id9x");
  });
});
