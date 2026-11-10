import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats US dollars as US$ with Argentine thousands separators", () => {
    expect(formatPrice(18900, "USD")).toBe("US$ 18.900");
  });

  it("formats Argentine pesos with the $ sign", () => {
    expect(formatPrice(25_500_000, "ARS")).toBe("$ 25.500.000");
  });

  it("rounds to whole units", () => {
    expect(formatPrice(14199.6, "USD")).toBe("US$ 14.200");
  });

  it("prefixes other currencies with their ISO code", () => {
    expect(formatPrice(1000, "EUR")).toBe("EUR 1.000");
  });
});
