import { business } from "@/config/business";
import { whatsappLink } from "./whatsapp";

/** WhatsApp link to the business number with an optional prefilled message. */
export function contactLink(message?: string): string {
  return whatsappLink(business.whatsapp, message);
}

/** Google Maps directions search for the showroom address. */
export function directionsLink(): string {
  const query = `${business.address.street}, ${business.address.locality}, ${business.address.region}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** tel: link for the phone number shown as `business.phoneDisplay`. */
export function phoneLink(): string {
  return `tel:+${business.phoneDisplay.replace(/\D/g, "")}`;
}

/** Home sections, used by the header menu and the footer. */
export const sectionLinks = [
  { label: "Stock", href: "/#stock" },
  { label: "Canje", href: "/#canje" },
  { label: "Financiación", href: "/#financiacion" },
  { label: "Contacto", href: "/#contacto" },
] as const;
