import { describe, expect, it } from "vitest";
import { normalizeStock } from "@/lib/stock/normalize";

const valid = {
  id: "3f2a9c1e-7b44-4d2a-9e0f-1c2b3a4d5e6f",
  name: "Toyota Corolla XEI 2.0",
  price: 18900,
  currency: "USD",
  photos: ["https://abc.supabase.co/storage/v1/object/public/p/1.jpg"],
};

describe("normalizeStock", () => {
  it("keeps only the contract fields and drops everything else", () => {
    const [vehicle] = normalizeStock([
      { ...valid, cost: 12000, plate: "AB123CD", client_id: "c-1", status: "for_sale" },
    ]);
    expect(vehicle).toEqual({
      id: valid.id,
      slug: "toyota-corolla-xei-2-0-3f2a9c",
      name: valid.name,
      price: 18900,
      currency: "USD",
      photos: valid.photos,
    });
    expect(vehicle).not.toHaveProperty("cost");
    expect(vehicle).not.toHaveProperty("plate");
    expect(vehicle).not.toHaveProperty("client_id");
    expect(vehicle).not.toHaveProperty("status");
  });

  it("skips records with a missing id, an empty name, or a non-positive price", () => {
    const result = normalizeStock([
      valid,
      { ...valid, id: undefined },
      { ...valid, id: "x2", name: "   " },
      { ...valid, id: "x3", price: 0 },
      { ...valid, id: "x4", price: "not a number" },
      { ...valid, id: "x5", currency: "dollars" },
      null,
      "garbage",
    ]);
    expect(result.map((v) => v.id)).toEqual([valid.id]);
  });

  it("accepts numeric ids and numeric price strings, and uppercases the currency", () => {
    const [vehicle] = normalizeStock([{ ...valid, id: 42, price: "14200.00", currency: "usd" }]);
    expect(vehicle?.id).toBe("42");
    expect(vehicle?.price).toBe(14200);
    expect(vehicle?.currency).toBe("USD");
  });

  it("keeps photo order and drops photos that are not http(s) URLs", () => {
    const [vehicle] = normalizeStock([
      {
        ...valid,
        photos: [
          "https://cdn.example.com/a.jpg",
          "javascript:alert(1)",
          42,
          "fixture:corolla-1",
          "https://cdn.example.com/b.jpg",
        ],
      },
    ]);
    expect(vehicle?.photos).toEqual([
      "https://cdn.example.com/a.jpg",
      "https://cdn.example.com/b.jpg",
    ]);
  });

  it("keeps a vehicle without valid photos, with an empty photo list", () => {
    const [vehicle] = normalizeStock([{ ...valid, photos: undefined }]);
    expect(vehicle?.photos).toEqual([]);
  });

  it("accepts fixture photo references only when explicitly allowed", () => {
    const [vehicle] = normalizeStock([{ ...valid, photos: ["fixture:corolla-1"] }], {
      allowFixturePhotos: true,
    });
    expect(vehicle?.photos).toEqual(["fixture:corolla-1"]);
  });

  it("skips duplicated ids, keeping the first occurrence", () => {
    const result = normalizeStock([valid, { ...valid, name: "Duplicate" }]);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe(valid.name);
  });

  it("gives every vehicle a unique slug even when name and id prefix collide", () => {
    const result = normalizeStock([
      { ...valid, id: "abcdef-1", name: "Fiat Cronos" },
      { ...valid, id: "abcdef-2", name: "Fiat Cronos" },
    ]);
    const slugs = result.map((v) => v.slug);
    expect(new Set(slugs).size).toBe(2);
  });

  it("throws when the payload is not an array", () => {
    expect(() => normalizeStock({ vehicles: [] })).toThrow(/array/);
  });
});
