import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import { mockSubmitGift } from "../../mocks/gifts.mock";

const mockInsert = vi.fn(() => ({
  values: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@lib/server/db", () => ({
  db: {
    insert: mockInsert,
  },
}));

const mockRateLimit = vi.fn();
vi.mock("@lib/server/ratelimit", () => ({
  rateLimit: mockRateLimit,
}));

let POST: any;

beforeAll(async () => {
  const module = await import("@pages/api/gifts/submit");
  POST = module.POST;
}, 20000);

describe("submit.ts - Submit Gift Endpoint", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully submit a new gift", async () => {
    mockRateLimit.mockReturnValue(true);
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(mockSubmitGift),
    });
    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Data uploaded to database successfully!");
    expect(mockInsert).toHaveBeenCalled();
  });

  it("should handle validation errors gracefully", async () => {
    mockRateLimit.mockReturnValue(true);
    const invalidGift = { ...mockSubmitGift, name: "" };
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(invalidGift),
    });
    const response = await POST({ request } as any);

    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).toContain("Validation failed");
  });

  it("should return 500 if method is not POST", async () => {
    const request = new Request("http://localhost", { method: "GET" });
    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Internal Server Error");
  });

  it("should return 500 if rate limited", async () => {
    mockRateLimit.mockReturnValue(false);
    const request = new Request("http://localhost", { method: "POST" });
    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Internal Server Error");
  });

  it("should handle submission errors gracefully", async () => {
    mockRateLimit.mockReturnValue(true);
    mockInsert.mockImplementation(() => ({
      values: vi.fn().mockRejectedValue(new Error("DB error")),
    }));
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(mockSubmitGift),
    });
    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Failed to upload data to database");
  });
});
