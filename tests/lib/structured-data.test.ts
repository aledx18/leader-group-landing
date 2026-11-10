import { describe, expect, it } from "vitest";
import { autoDealerNode } from "@/lib/structured-data";

const business = {
  name: "Leader Group",
  description: "Venta de autos usados.",
  phone: "+54 9 11 1234-5678",
  address: {
    street: "Av. Principal 1234",
    locality: "Ciudad",
    region: "Buenos Aires",
    postalCode: "1000",
    country: "AR",
  },
  openingHours: ["Mo-Fr 09:00-19:00", "Sa 09:00-14:00"],
  socials: [{ label: "Instagram", href: "https://instagram.com/example" }],
};

describe("autoDealerNode", () => {
  const node = autoDealerNode(business, "https://leadergroup.example");

  it("describes the business as an AutoDealer with the organization id", () => {
    expect(node["@type"]).toBe("AutoDealer");
    expect(node["@id"]).toBe("https://leadergroup.example/#organization");
    expect(node.name).toBe("Leader Group");
    expect(node.url).toBe("https://leadergroup.example/");
    expect(node.logo).toEqual({
      "@type": "ImageObject",
      url: "https://leadergroup.example/icon-512.png",
      width: 512,
      height: 512,
    });
  });

  it("includes phone, postal address, opening hours and social profiles", () => {
    expect(node.telephone).toBe("+5491112345678");
    expect(node.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "Av. Principal 1234",
      addressLocality: "Ciudad",
      addressRegion: "Buenos Aires",
      postalCode: "1000",
      addressCountry: "AR",
    });
    expect(node.openingHours).toEqual(["Mo-Fr 09:00-19:00", "Sa 09:00-14:00"]);
    expect(node.sameAs).toEqual(["https://instagram.com/example"]);
  });

  it("never includes ratings or reviews", () => {
    expect(node).not.toHaveProperty("aggregateRating");
    expect(node).not.toHaveProperty("review");
  });
});
