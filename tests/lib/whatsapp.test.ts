import { describe, expect, it } from "vitest";
import { vehicleInquiryMessage, whatsappLink } from "@/lib/whatsapp";

describe("whatsappLink", () => {
  it("builds a wa.me link with only the digits of the number", () => {
    expect(whatsappLink("+54 9 11 1234-5678")).toBe("https://wa.me/5491112345678");
  });

  it("adds the message url-encoded as the text parameter", () => {
    expect(whatsappLink("5491112345678", "Hola, ¿está disponible? 100% & más")).toBe(
      "https://wa.me/5491112345678?text=Hola%2C%20%C2%BFest%C3%A1%20disponible%3F%20100%25%20%26%20m%C3%A1s",
    );
  });

  it("omits the text parameter for a blank message", () => {
    expect(whatsappLink("5491112345678", "   ")).toBe("https://wa.me/5491112345678");
  });

  it("throws when the number has no digits", () => {
    expect(() => whatsappLink("TODO")).toThrow(/WhatsApp number/);
  });
});

describe("vehicleInquiryMessage", () => {
  it("names the vehicle and includes its page url", () => {
    expect(
      vehicleInquiryMessage(
        "Toyota Corolla XEI 2.0",
        "https://leadergroup.example/autos/toyota-corolla-xei-2-0-7c1e2a/",
      ),
    ).toBe(
      "Hola, quiero consultar por el Toyota Corolla XEI 2.0: https://leadergroup.example/autos/toyota-corolla-xei-2-0-7c1e2a/",
    );
  });
});
