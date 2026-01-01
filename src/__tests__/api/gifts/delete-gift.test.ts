/// <reference types="vitest/globals" />

import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";

const mockExecute = vi.fn();
const mockLimit = vi.fn(() => ({ execute: mockExecute }));
const mockWhere = vi.fn(() => ({ limit: mockLimit }));
const mockDelete = vi.fn(() => ({ where: mockWhere }));

vi.mock("@lib/server/db", () => ({
  db: {
    delete: mockDelete,
  },
}));

const mockRateLimit = vi.fn();
vi.mock("@lib/server/ratelimit", () => ({
  rateLimit: mockRateLimit,
}));

let DELETE: any;

beforeAll(async () => {
  const module = await import("@pages/api/gifts/delete-gift/[giftId]");
  DELETE = module.DELETE;
});

describe("delete-gift/[giftId].ts - Delete Gift Endpoint", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully delete a gift by ID", async () => {
    mockRateLimit.mockReturnValue(true);
    mockExecute.mockResolvedValue(undefined);

    const request = new Request("http://localhost", { method: "DELETE" });
    const params = { giftId: "123" };
    const response = await DELETE({ request, params } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Gift ID: 123 successfully deleted");
    expect(mockDelete).toHaveBeenCalled();
  });

  it("should return 500 error if gift ID is not a number", async () => {
    mockRateLimit.mockReturnValue(true);

    const request = new Request("http://localhost", { method: "DELETE" });
    const params = { giftId: "abc" };
    const response = await DELETE({ request, params } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Could not cast gift ID to a number");
  });

  it("should return 500 error if database operation fails", async () => {
    mockRateLimit.mockReturnValue(true);
    mockExecute.mockRejectedValue(new Error("DB error"));

    const request = new Request("http://localhost", { method: "DELETE" });
    const params = { giftId: "123" };
    const response = await DELETE({ request, params } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Failed to delete data from database");
  });

  it("should return 500 error if rate limited", async () => {
    mockRateLimit.mockReturnValue(false);

    const request = new Request("http://localhost", { method: "DELETE" });
    const params = { giftId: "123" };
    const response = await DELETE({ request, params } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Internal Server Error");
  });
});
