/**
 * Business data shown across the site. EVERY value here is a placeholder.
 * Replace each one marked TODO(real data) before going live; sections read only from here.
 */
export const business = {
  name: "Leader Group",
  description: "Venta de autos usados seleccionados. Compra, venta, canje y financiación.",

  /** TODO(real data): WhatsApp number with country code (wa.me format, digits are extracted). */
  whatsapp: "+54 9 11 1234-5678",
  /** TODO(real data): phone as displayed. */
  phoneDisplay: "+54 9 11 1234-5678",
  phoneNote: "Llamadas y WhatsApp",

  /** TODO(real data): showroom address. */
  address: {
    street: "Av. Principal 1234",
    locality: "Ciudad",
    region: "Buenos Aires",
    postalCode: "0000",
    country: "AR",
    display: "Av. Principal 1234, Ciudad",
    note: "A 2 cuadras de la estación",
  },

  /** TODO(real data): opening hours (display text and schema.org openingHours). */
  hours: {
    primary: "Lunes a viernes 9 a 19 h",
    secondary: "Sábados 9 a 14 h",
    schema: ["Mo-Fr 09:00-19:00", "Sa 09:00-14:00"],
  },

  /** TODO(real data): social profiles. */
  socials: [
    {
      label: "Instagram",
      icon: "instagram",
      href: "https://www.instagram.com/leadergroup.placeholder/",
    },
    {
      label: "Facebook",
      icon: "facebook",
      href: "https://www.facebook.com/leadergroup.placeholder/",
    },
  ],

  /** TODO(real data): hero statistics. */
  stats: [
    { value: "+1.200", label: "autos entregados" },
    { value: "12 años", label: "en el mercado" },
    { value: "4.8 ★", label: "en Google" },
  ],

  /** TODO(real data): customer testimonial (shown as text only, never as Review JSON-LD). */
  testimonial: {
    quote:
      "Me mandaron fotos, video y el informe del auto antes de ir. Llegué, lo probé y en dos horas me fui manejando. Cero sorpresas.",
    author: "Martín G.",
    detail: "Compró un Toyota Corolla 2021",
  },

  /** TODO(real data): financing example. */
  financing: {
    downPaymentPercent: 40,
    example: "Peugeot 208",
    price: 14200,
    downPayment: 5680,
    installments: 36,
    installment: 289,
    currency: "USD",
    disclaimer:
      "Valores de referencia. Sujeto a aprobación crediticia. Solo con DNI y recibo de sueldo.",
  },

  /** Prefilled WhatsApp messages. */
  messages: {
    general: "Hola, quiero consultar por los autos disponibles.",
    tradeIn: "Hola, quiero cotizar mi usado.",
    financing: "Hola, quiero consultar por la financiación.",
  },
} as const;

export type Business = typeof business;
