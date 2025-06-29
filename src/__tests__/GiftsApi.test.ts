import { beforeEach, describe, expect, test, vi } from "vitest";

import { DELETE } from "@pages/api/gifts/delete-gift/[giftId]";
import { GET } from "@pages/api/gifts/data";
import { eq } from "drizzle-orm";
import { giftsTable } from "@models/schema";

// Mock the db module with proper chaining
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockDelete = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();
const mockExecute = vi.fn();

vi.mock("@lib/server/db", () => ({
  db: {
    select: mockSelect,
    delete: mockDelete,
  },
}));

vi.mock("@lib/server/ratelimit", () => ({
  rateLimit: vi.fn(() => true),
}));

describe("Gifts API - GET /api/gifts/data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup select chain
    mockSelect.mockReturnValue({
      from: mockFrom,
    });
  });

  test("should return all gifts with a 200 status code", async () => {
    // Arrange
    const mockGifts = [
      { id: 1, name: "Gift 1", price: "100", link: "https://example.com/1" },
      { id: 2, name: "Gift 2", price: "200", link: "https://example.com/2" },
    ];
    mockFrom.mockResolvedValue(mockGifts);

    const request = new Request("http://example.com/api/gifts/data", {
      method: "GET",
    });

    // Act
    const response = await GET({
      request,
      redirect: (path: string) =>
        new Response(null, { status: 302, headers: { Location: path } }),
    } as any);

    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.body).toEqual(mockGifts);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith(giftsTable);
  });

  test("should return 500 if there is a database error", async () => {
    // Arrange
    mockFrom.mockRejectedValue(new Error("DB Error"));

    const request = new Request("http://example.com/api/gifts/data", {
      method: "GET",
    });

    // Act
    const response = await GET({
      request,
      redirect: (path: string) =>
        new Response(null, { status: 302, headers: { Location: path } }),
    } as any);

    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.message).toBe("Error fetching row data from database");
  });
});

describe("Gifts API - DELETE /api/gifts/delete-gift/:giftId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup delete chain
    mockDelete.mockReturnValue({
      where: mockWhere,
    });
    mockWhere.mockReturnValue({
      limit: mockLimit,
    });
    mockLimit.mockReturnValue({
      execute: mockExecute,
    });
  });

  test("should delete a gift and return 200", async () => {
    // Arrange
    const giftId = 123;
    mockExecute.mockResolvedValue({ rowCount: 1 });

    const request = new Request(
      `http://example.com/api/gifts/delete-gift/${giftId}`,
      {
        method: "DELETE",
      },
    );

    // Act
    const response = await DELETE({
      request,
      params: { giftId: giftId.toString() },
    } as any);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.message).toBe(`Gift ID: ${giftId} successfully deleted`);
    expect(mockDelete).toHaveBeenCalledWith(giftsTable);
    expect(mockWhere).toHaveBeenCalledWith(eq(giftsTable.id, giftId));
    expect(mockLimit).toHaveBeenCalledWith(1);
    expect(mockExecute).toHaveBeenCalled();
  });

  test("should return 500 if giftId is not a number", async () => {
    // Arrange
    const giftId = "abc";
    const request = new Request(
      `http://example.com/api/gifts/delete-gift/${giftId}`,
      {
        method: "DELETE",
      },
    );

    // Act
    const response = await DELETE({
      request,
      params: { giftId },
    } as any);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.message).toBe("Could not cast gift ID to a number");
  });

  test("should return 500 on database error", async () => {
    // Arrange
    const giftId = 456;
    mockExecute.mockRejectedValue(new Error("DB Error"));

    const request = new Request(
      `http://example.com/api/gifts/delete-gift/${giftId}`,
      {
        method: "DELETE",
      },
    );

    // Act
    const response = await DELETE({
      request,
      params: { giftId: giftId.toString() },
    } as any);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.message).toBe("Failed to delete data from database");
  });
});
