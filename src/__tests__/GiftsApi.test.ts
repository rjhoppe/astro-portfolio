import { beforeEach, describe, expect, test, vi } from "vitest";

import { DELETE } from "@pages/api/gifts/delete-gift/[giftId]";
import { GET } from "@pages/api/gifts/data";

// Global mock state
let mockDbError = false;
let mockDbData: any[] = [];

// Mock the db module
vi.mock("@lib/server/db", () => {
  const mockSelect = vi.fn(() => ({
    from: vi.fn(() => {
      if (mockDbError) {
        return Promise.reject(new Error("DB Error"));
      }
      return Promise.resolve(mockDbData);
    }),
  }));

  const mockDelete = vi.fn(() => ({
    where: vi.fn(() => ({
      limit: vi.fn(() => ({
        execute: vi.fn(() => {
          if (mockDbError) {
            return Promise.reject(new Error("DB Error"));
          }
          return Promise.resolve({ rowCount: 1 });
        }),
      })),
    })),
  }));

  return {
    db: {
      select: mockSelect,
      delete: mockDelete,
    },
  };
});

vi.mock("@lib/server/ratelimit", () => ({
  rateLimit: vi.fn(() => true),
}));

describe("Gifts API - GET /api/gifts/data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDbError = false;
    mockDbData = [];
  });

  test("should return all gifts with a 200 status code", async () => {
    // Arrange
    mockDbData = [
      { id: 1, name: "Gift 1", price: "100", link: "https://example.com/1" },
      { id: 2, name: "Gift 2", price: "200", link: "https://example.com/2" },
    ];

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
    expect(data.body).toEqual(mockDbData);
  });

  test("should return 500 if there is a database error", async () => {
    // Arrange
    mockDbError = true;

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
    mockDbError = false;
  });

  test("should delete a gift and return 200", async () => {
    // Arrange
    const giftId = 123;

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
    mockDbError = true;
    const giftId = 456;

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
