/** JSON-LD node builders (schema.org). Pure functions, no Astro imports. */
import type { Vehicle } from "./stock/types";

type JsonLdNode = Record<string, unknown>;

export interface DealerInfo {
  name: string;
  description: string;
  phone: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  /** schema.org openingHours strings, for example "Mo-Fr 09:00-19:00". */
  openingHours: readonly string[];
  socials: readonly { label: string; href: string }[];
}

function origin(siteUrl: string): string {
  return siteUrl.replace(/\/$/, "");
}

/** E.164-ish telephone: "+" followed by digits only. */
function telephone(phone: string): string {
  return `+${phone.replace(/\D/g, "")}`;
}

/**
 * The business as an AutoDealer (a LocalBusiness subtype). It replaces the generic
 * Organization node so `publisher` references resolve to it. No ratings or reviews.
 */
export function autoDealerNode(dealer: DealerInfo, siteUrl: string): JsonLdNode {
  const base = origin(siteUrl);
  return {
    "@type": "AutoDealer",
    "@id": `${base}/#organization`,
    name: dealer.name,
    description: dealer.description,
    url: `${base}/`,
    logo: { "@type": "ImageObject", url: `${base}/icon-512.png`, width: 512, height: 512 },
    image: `${base}/og.png`,
    telephone: telephone(dealer.phone),
    address: {
      "@type": "PostalAddress",
      streetAddress: dealer.address.street,
      addressLocality: dealer.address.locality,
      addressRegion: dealer.address.region,
      postalCode: dealer.address.postalCode,
      addressCountry: dealer.address.country,
    },
    openingHours: [...dealer.openingHours],
    sameAs: dealer.socials.map((social) => social.href),
  };
}

export interface CarNodeInput {
  vehicle: Vehicle;
  /** Absolute canonical URL of the vehicle page. */
  pageUrl: string;
  /** Absolute URLs of the optimized photos, cover first. Empty omits `image`. */
  images: readonly string[];
  siteUrl: string;
}

/** A used Car with an in-stock Offer sold by the site's AutoDealer node. */
export function carNode({ vehicle, pageUrl, images, siteUrl }: CarNodeInput): JsonLdNode {
  const condition = "https://schema.org/UsedCondition";
  return {
    "@type": "Car",
    "@id": `${pageUrl}#vehicle`,
    name: vehicle.name,
    url: pageUrl,
    ...(images.length > 0 ? { image: [...images] } : {}),
    itemCondition: condition,
    offers: {
      "@type": "Offer",
      url: pageUrl,
      price: vehicle.price,
      priceCurrency: vehicle.currency,
      availability: "https://schema.org/InStock",
      itemCondition: condition,
      seller: { "@id": `${origin(siteUrl)}/#organization` },
    },
  };
}

/** BreadcrumbList for a page, items in order (absolute URLs). */
export function breadcrumbNode(
  pageUrl: string,
  items: readonly { name: string; url: string }[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
