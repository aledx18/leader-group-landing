import { describe, expect, it } from "vitest";
import { autoDealerNode, breadcrumbNode, carNode } from "@/lib/structured-data";

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

describe("carNode", () => {
  const node = carNode({
    vehicle: {
      id: "7c1e2a90",
      slug: "toyota-corolla-xei-2-0-7c1e2a",
      name: "Toyota Corolla XEI 2.0",
      price: 18900,
      currency: "USD",
      photos: ["https://abc.supabase.co/a.jpg"],
    },
    pageUrl: "https://leadergroup.example/autos/toyota-corolla-xei-2-0-7c1e2a/",
    images: [
      "https://leadergroup.example/_astro/a.webp",
      "https://leadergroup.example/_astro/b.webp",
    ],
    siteUrl: "https://leadergroup.example/",
  });

  it("describes the vehicle as a used Car with its page url and images", () => {
    expect(node["@type"]).toBe("Car");
    expect(node["@id"]).toBe(
      "https://leadergroup.example/autos/toyota-corolla-xei-2-0-7c1e2a/#vehicle",
    );
    expect(node.name).toBe("Toyota Corolla XEI 2.0");
    expect(node.url).toBe("https://leadergroup.example/autos/toyota-corolla-xei-2-0-7c1e2a/");
    expect(node.image).toEqual([
      "https://leadergroup.example/_astro/a.webp",
      "https://leadergroup.example/_astro/b.webp",
    ]);
    expect(node.itemCondition).toBe("https://schema.org/UsedCondition");
  });

  it("includes an in-stock Offer with price, currency and the dealer as seller", () => {
    expect(node.offers).toEqual({
      "@type": "Offer",
      url: "https://leadergroup.example/autos/toyota-corolla-xei-2-0-7c1e2a/",
      price: 18900,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@id": "https://leadergroup.example/#organization" },
    });
  });

  it("never includes ratings or reviews", () => {
    expect(node).not.toHaveProperty("aggregateRating");
    expect(node).not.toHaveProperty("review");
  });
});

describe("breadcrumbNode", () => {
  it("lists the items in order with 1-based positions and absolute urls", () => {
    expect(
      breadcrumbNode("https://leadergroup.example/autos/x/", [
        { name: "Inicio", url: "https://leadergroup.example/" },
        { name: "Toyota Corolla XEI 2.0", url: "https://leadergroup.example/autos/x/" },
      ]),
    ).toEqual({
      "@type": "BreadcrumbList",
      "@id": "https://leadergroup.example/autos/x/#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://leadergroup.example/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Toyota Corolla XEI 2.0",
          item: "https://leadergroup.example/autos/x/",
        },
      ],
    });
  });
});
