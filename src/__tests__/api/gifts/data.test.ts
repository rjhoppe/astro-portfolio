import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import { mockGifts } from "../../mocks/gifts.mock";

const mockSelect = vi.fn(() => ({
  from: vi.fn().mockResolvedValue(mockGifts),
}));
vi.mock("@lib/server/db", () => ({
  db: {
    select: mockSelect,
  },
}));

let GET: any;

beforeAll(async () => {
  const module = await import("@pages/api/gifts/data");
  GET = module.GET;
});

describe("data.ts - Gift Data Endpoint", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully retrieve all gifts", async () => {
    const request = new Request("http://localhost", { method: "GET" });
    const response = await GET({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.body).toEqual(mockGifts);
    expect(mockSelect).toHaveBeenCalled();
  });

  it("should handle data retrieval errors gracefully", async () => {
    mockSelect.mockImplementation(() => ({
      from: vi.fn().mockRejectedValue(new Error("DB error")),
    }));
    const request = new Request("http://localhost", { method: "GET" });
    const response = await GET({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Error fetching row data from database");
  });

  it("should return 405 if method is not GET", async () => {
    const request = new Request("http://localhost", { method: "POST" });
    const response = await GET({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(405);
    expect(data.message).toContain("Method not allowed");
  });
});
