const CURRENCY_PREFIX: Record<string, string> = {
  USD: "US$",
  ARS: "$",
};

const amountFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** Price as shown in Argentina: "US$ 18.900", "$ 25.500.000", "EUR 1.000". */
export function formatPrice(price: number, currency: string): string {
  const prefix = CURRENCY_PREFIX[currency] ?? currency;
  return `${prefix} ${amountFormatter.format(Math.round(price))}`;
}
