/**
 * WhatsApp click-to-chat link: https://wa.me/<digits>?text=<url-encoded message>.
 * The number may include "+", spaces or dashes; only digits are kept.
 */
export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 0) {
    throw new Error(`Invalid WhatsApp number "${phone}": it must contain digits.`);
  }
  const text = message?.trim();
  return text
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${digits}`;
}

/** Prefilled message for a vehicle page: names the vehicle and links to it. */
export function vehicleInquiryMessage(vehicleName: string, pageUrl: string): string {
  return `Hola, quiero consultar por el ${vehicleName}: ${pageUrl}`;
}
