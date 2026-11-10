/**
 * Local stock used when STOCK_API_URL is not set (development and previews before the
 * Supabase endpoint exists). Invented vehicles; photos are generated placeholders in
 * src/assets/fixture/, referenced as `fixture:<file name without extension>`.
 * Raw records go through the same allowlist and validation as the endpoint payload.
 */
export const stockFixture: unknown[] = [
  {
    id: "7c1e2a90-4b1d-4f7a-9a51-0d6e3c2b9f11",
    name: "Toyota Corolla XEI 2.0",
    price: 18900,
    currency: "USD",
    photos: ["fixture:corolla-1", "fixture:corolla-2", "fixture:corolla-3"],
  },
  {
    id: "a4f09d37-2c88-4e15-b6a2-5f3d7e8c1a02",
    name: "Volkswagen Amarok V6",
    price: 27500,
    currency: "USD",
    photos: ["fixture:amarok-1", "fixture:amarok-2"],
  },
  {
    id: "e93b6c14-8d2f-4a6b-8c3e-2b1a0f9d7e43",
    name: "Peugeot 208 Allure",
    price: 14200,
    currency: "USD",
    photos: ["fixture:peugeot-1", "fixture:peugeot-2"],
  },
  {
    id: "5d2a8e61-0f4c-4b9d-a7e3-9c6b1d2e3f54",
    name: "Fiat Cronos Precision 1.3",
    price: 21500000,
    currency: "ARS",
    photos: ["fixture:cronos-1"],
  },
];
