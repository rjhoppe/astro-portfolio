import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import { mockErrorReport } from "../../mocks/gifts.mock";

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

let POST: any;

beforeAll(async () => {
  const module = await import("@pages/api/gifts/report-error");
  POST = module.POST;
});

describe("report-error.ts - Report Error Endpoint", () => {
  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_ADDRESS;
  });

  it("should successfully report an error", async () => {
    mockRateLimit.mockReturnValue(true);
    process.env.RESEND_API_KEY = "test-key";
    process.env.EMAIL_ADDRESS = "test@example.com";
    mockSend.mockResolvedValue(undefined);

    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(mockErrorReport),
    });
    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain("forwarded to Rick");
    expect(mockSend).toHaveBeenCalled();
  });

  it("should return 405 if method is not POST", async () => {
    const request = new Request("http://localhost", { method: "GET" });
    const response = await POST({ request } as any);
    expect(response.status).toBe(405);
  });

  it("should return 429 if rate limited", async () => {
    mockRateLimit.mockReturnValue(false);
    const request = new Request("http://localhost", { method: "POST" });
    const response = await POST({ request } as any);
    expect(response.status).toBe(429);
  });

  it("should return 500 if server config is missing", async () => {
    mockRateLimit.mockReturnValue(true);
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(mockErrorReport),
    });
    const response = await POST({ request } as any);
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.message).toContain("Server configuration error");
  });

  it("should return 500 if request body is invalid", async () => {
    mockRateLimit.mockReturnValue(true);
    process.env.RESEND_API_KEY = "test-key";
    process.env.EMAIL_ADDRESS = "test@example.com";

    const request = new Request("http://localhost", {
      method: "POST",
      body: "invalid json",
    });
    const response = await POST({ request } as any);
    expect(response.status).toBe(500);
  });

  it("should return 500 if email sending fails", async () => {
    mockRateLimit.mockReturnValue(true);
    process.env.RESEND_API_KEY = "test-key";
    process.env.EMAIL_ADDRESS = "test@example.com";
    mockSend.mockRejectedValue(new Error("Send failed"));

    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(mockErrorReport),
    });
    const response = await POST({ request } as any);
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.message).toContain("Issue submitting error report");
  });
});
