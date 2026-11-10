import { business } from "@/config/business";
import { site } from "@/config/site";
import { autoDealerNode } from "./structured-data";

/** The site-wide AutoDealer JSON-LD node built from src/config/business.ts. */
export function dealerJsonLd(): Record<string, unknown> {
  return autoDealerNode(
    {
      name: business.name,
      description: business.description,
      phone: business.whatsapp,
      address: business.address,
      openingHours: business.hours.schema,
      socials: business.socials,
    },
    site.url,
  );
}
