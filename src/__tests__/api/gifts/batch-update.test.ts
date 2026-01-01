/// <reference types="vitest/globals" />

import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import { mockBatchGifts } from "../../mocks/gifts.mock";

const mockRun = vi.fn();
const mockSet = vi.fn(() => ({ where: vi.fn(() => ({ run: mockRun })) }));
const mockUpdate = vi.fn(() => ({ set: mockSet }));
const mockTransaction = vi.fn((callback) => callback({ update: mockUpdate }));

vi.mock("@lib/server/db", () => ({
  db: {
    transaction: mockTransaction,
  },
}));

const mockRateLimit = vi.fn();
vi.mock("@lib/server/ratelimit", () => ({
  rateLimit: mockRateLimit,
}));

let PUT: any;

beforeAll(async () => {
  const module = await import("@pages/api/gifts/batch-update");
  PUT = module.PUT;
});

describe("batch-update.ts - Batch Gift Update Endpoint", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully update multiple gifts", async () => {
    mockRateLimit.mockReturnValue(true);
    const request = new Request("http://localhost", {
      method: "PUT",
      body: JSON.stringify(mockBatchGifts),
    });
    const response = await PUT({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Updates successful");
    expect(data.updatedCount).toBe(mockBatchGifts.length);
    expect(mockTransaction).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledTimes(mockBatchGifts.length);
  });

  it("should handle invalid or empty update request", async () => {
    mockRateLimit.mockReturnValue(true);
    const request = new Request("http://localhost", {
      method: "PUT",
      body: JSON.stringify([]),
    });
    const response = await PUT({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid or empty update request");
  });

  it("should handle invalid update within the batch", async () => {
    mockRateLimit.mockReturnValue(true);
    const invalidBatch = [{ ...mockBatchGifts[0], id: undefined }];
    const request = new Request("http://localhost", {
      method: "PUT",
      body: JSON.stringify(invalidBatch),
    });
    const response = await PUT({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("Invalid update for id");
  });

  it("should return 500 if method is not PUT", async () => {
    const request = new Request("http://localhost", { method: "POST" });
    const response = await PUT({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Internal Server Error");
  });

  it("should return 500 if rate limited", async () => {
    mockRateLimit.mockReturnValue(false);
    const request = new Request("http://localhost", { method: "PUT" });
    const response = await PUT({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Internal Server Error");
  });

  it("should handle db transaction errors gracefully", async () => {
    mockRateLimit.mockReturnValue(true);
    mockTransaction.mockImplementation(() => {
      throw new Error("DB transaction failed");
    });
    const request = new Request("http://localhost", {
      method: "PUT",
      body: JSON.stringify(mockBatchGifts),
    });
    const response = await PUT({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("DB transaction failed");
  });
});
