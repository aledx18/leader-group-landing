import { describe, expect, it, vi } from "vitest";
import { loadStock } from "@/lib/stock/loader";

const remote = [
  {
    id: "3f2a9c1e-7b44",
    name: "Volkswagen Amarok V6",
    price: 27500,
    currency: "USD",
    photos: ["https://abc.supabase.co/storage/v1/object/sign/p/1.jpg?token=t"],
    cost: 20000,
    plate: "AA000AA",
  },
];

const fixture = [
  { id: "fx-1", name: "Auto de ejemplo", price: 1000, currency: "USD", photos: ["fixture:a"] },
];

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("loadStock", () => {
  it("uses the local fixture and never calls fetch when the url is not set", async () => {
    const fetchMock = vi.fn();
    const result = await loadStock({ url: undefined, fixture, fetch: fetchMock });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.source).toBe("fixture");
    expect(result.vehicles.map((v) => v.id)).toEqual(["fx-1"]);
    expect(result.vehicles[0]?.photos).toEqual(["fixture:a"]);
  });

  it("treats an empty url as not set", async () => {
    const fetchMock = vi.fn();
    const result = await loadStock({ url: "  ", fixture, fetch: fetchMock });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.source).toBe("fixture");
  });

  it("fetches the endpoint, sends the key as apikey and bearer, and drops unknown fields", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(remote));
    const result = await loadStock({
      url: "https://abc.supabase.co/rest/v1/rpc/public_stock",
      apiKey: "anon-key",
      fixture,
      fetch: fetchMock,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(calledUrl).toBe("https://abc.supabase.co/rest/v1/rpc/public_stock");
    const headers = new Headers(init.headers);
    expect(headers.get("apikey")).toBe("anon-key");
    expect(headers.get("authorization")).toBe("Bearer anon-key");
    expect(headers.get("accept")).toBe("application/json");

    expect(result.source).toBe("endpoint");
    expect(result.vehicles).toHaveLength(1);
    expect(result.vehicles[0]).not.toHaveProperty("cost");
    expect(result.vehicles[0]).not.toHaveProperty("plate");
    expect(result.vehicles[0]?.name).toBe("Volkswagen Amarok V6");
  });

  it("sends no auth headers when no key is configured", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(remote));
    await loadStock({ url: "https://api.example.com/stock", fixture, fetch: fetchMock });
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const headers = new Headers(init.headers);
    expect(headers.has("apikey")).toBe(false);
    expect(headers.has("authorization")).toBe(false);
  });

  it("does not accept fixture photo references from the endpoint", async () => {
    const fetchMock = vi.fn(async () => jsonResponse([{ ...remote[0], photos: ["fixture:a"] }]));
    const result = await loadStock({
      url: "https://api.example.com/stock",
      fixture,
      fetch: fetchMock,
    });
    expect(result.vehicles[0]?.photos).toEqual([]);
  });

  it("skips invalid records returned by the endpoint", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse([...remote, { id: "broken", name: "", price: -1, currency: "USD" }]),
    );
    const result = await loadStock({
      url: "https://api.example.com/stock",
      fixture,
      fetch: fetchMock,
    });
    expect(result.vehicles.map((v) => v.id)).toEqual(["3f2a9c1e-7b44"]);
    expect(result.skipped).toBe(1);
  });

  it("returns an empty stock when the endpoint returns an empty list", async () => {
    const fetchMock = vi.fn(async () => jsonResponse([]));
    const result = await loadStock({
      url: "https://api.example.com/stock",
      fixture,
      fetch: fetchMock,
    });
    expect(result.vehicles).toEqual([]);
    expect(result.source).toBe("endpoint");
  });

  it("throws when the url is set and the endpoint answers with an error status", async () => {
    const fetchMock = vi.fn(async () => new Response("nope", { status: 401 }));
    await expect(
      loadStock({ url: "https://api.example.com/stock", fixture, fetch: fetchMock }),
    ).rejects.toThrow(/401/);
  });

  it("throws when the url is set and the request fails", async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(
      loadStock({ url: "https://api.example.com/stock", fixture, fetch: fetchMock }),
    ).rejects.toThrow(/fetch failed/);
  });

  it("throws when the url is set and the body is not a JSON array", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ message: "oops" }));
    await expect(
      loadStock({ url: "https://api.example.com/stock", fixture, fetch: fetchMock }),
    ).rejects.toThrow(/array/);
  });

  it("does not leak the api key in error messages", async () => {
    const fetchMock = vi.fn(async () => new Response("bad", { status: 500 }));
    const error = await loadStock({
      url: "https://api.example.com/stock",
      apiKey: "super-secret",
      fixture,
      fetch: fetchMock,
    }).catch((e: unknown) => e as Error);
    expect(String(error)).not.toContain("super-secret");
  });
});
