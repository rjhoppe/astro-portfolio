import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";

const mockSend = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

const mockRateLimit = vi.fn();
vi.mock("@lib/server/ratelimit", () => ({
  rateLimit: mockRateLimit,
}));

const mockExistsSync = vi.fn();
const mockReadFileSync = vi.fn();
vi.mock("fs", () => ({
  default: {
    existsSync: mockExistsSync,
    readFileSync: mockReadFileSync,
  },
}));

let POST: any;

beforeAll(async () => {
  const module = await import("@pages/api/gifts/back-up");
  POST = module.POST;
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("EMAIL_ADDRESS", "test@example.com");
});

describe("back-up.ts - Gift Backup Endpoint", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully create a backup of gifts", async () => {
    mockRateLimit.mockReturnValue(true);
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(Buffer.from("test data"));
    mockSend.mockResolvedValue(undefined);

    const request = new Request("http://localhost", { method: "POST" });
    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain("back-up created");
    expect(mockSend).toHaveBeenCalled();
  });

  it("should handle case where file does not exist", async () => {
    mockRateLimit.mockReturnValue(true);
    mockExistsSync.mockReturnValue(false);

    const request = new Request("http://localhost", { method: "POST" });
    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain("back-up created");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("should return 500 if method is not POST", async () => {
    mockRateLimit.mockReturnValue(true);
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

  it("should handle backup errors gracefully", async () => {
    mockRateLimit.mockReturnValue(true);
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(Buffer.from("test data"));
    mockSend.mockRejectedValue(new Error("Send failed"));

    const request = new Request("http://localhost", { method: "POST" });
    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toContain("Error backing up database");
  });
});
