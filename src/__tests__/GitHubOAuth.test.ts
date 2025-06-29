import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { createSession, setSessionTokenCookie } from "@lib/server/session";

import { GET as callbackHandler } from "@pages/login/github/callback";
import { GET as loginHandler } from "@pages/login/github/index";

// Mock environment variables
beforeAll(() => {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("GITHUB_CLIENT_ID", "test-client-id");
  vi.stubEnv("GITHUB_CLIENT_SECRET", "test-client-secret");
});

afterAll(() => {
  vi.unstubAllEnvs();
});

// Mock the GitHub OAuth module
vi.mock("@lib/server/oauth", () => ({
  github: {
    createAuthorizationURL: vi.fn(
      () =>
        new URL(
          "https://github.com/login/oauth/authorize?client_id=test&state=test-state",
        ),
    ),
    validateAuthorizationCode: vi.fn(() => ({
      accessToken: () => "test-access-token",
    })),
  },
}));

// Mock the session module
vi.mock("@lib/server/session", () => ({
  createSession: vi.fn(() =>
    Promise.resolve({
      id: "test-session-id",
      userId: 1,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    }),
  ),
  generateSessionToken: vi.fn(() => "test-session-token"),
  setSessionTokenCookie: vi.fn(),
}));

// Mock the database
vi.mock("@lib/server/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => ({
            execute: vi.fn(() => Promise.resolve([])),
          })),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() =>
          Promise.resolve([{ id: 1, githubId: 123456, username: "rjhoppe" }]),
        ),
      })),
    })),
  },
}));

// Mock fetch for GitHub API calls
global.fetch = vi.fn();

describe("GitHub OAuth - Login Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should redirect to GitHub OAuth URL and set state cookie", async () => {
    // Arrange
    const mockCookies = {
      set: vi.fn(),
    };

    const mockRedirect = vi.fn(() => new Response(null, { status: 302 }));

    // Act
    await loginHandler({
      cookies: mockCookies,
      redirect: mockRedirect,
    } as any);

    // Assert
    expect(mockCookies.set).toHaveBeenCalledWith(
      "github_oauth_state",
      expect.any(String),
      {
        path: "/",
        secure: false, // false in test environment
        httpOnly: true,
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
      },
    );
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("github.com/login/oauth/authorize"),
    );
  });
});

describe("GitHub OAuth - Callback Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return 400 if code or state is missing", async () => {
    // Arrange
    const mockContext = {
      url: new URL("http://localhost:4321/login/github/callback"),
      cookies: {
        get: vi.fn(() => ({ value: "test-state" })),
      },
      redirect: vi.fn(),
    };

    // Act
    const response = await callbackHandler(mockContext as any);

    // Assert
    expect(response.status).toBe(400);
  });

  test("should return 400 if state doesn't match", async () => {
    // Arrange
    const mockContext = {
      url: new URL(
        "http://localhost:4321/login/github/callback?code=test-code&state=wrong-state",
      ),
      cookies: {
        get: vi.fn(() => ({ value: "correct-state" })),
      },
      redirect: vi.fn(),
    };

    // Act
    const response = await callbackHandler(mockContext as any);

    // Assert
    expect(response.status).toBe(400);
  });

  test("should redirect to forbidden if username is not rjhoppe", async () => {
    // Arrange
    const mockContext = {
      url: new URL(
        "http://localhost:4321/login/github/callback?code=test-code&state=test-state",
      ),
      cookies: {
        get: vi.fn(() => ({ value: "test-state" })),
      },
      redirect: vi.fn(() => new Response(null, { status: 302 })),
    };

    // Mock GitHub API response for different user
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve({ id: 123456, login: "different-user" }),
    } as Response);

    // Act
    await callbackHandler(mockContext as any);

    // Assert
    expect(mockContext.redirect).toHaveBeenCalledWith("/forbidden");
  });

  test("should create new user and session for valid callback", async () => {
    // Arrange
    const mockContext = {
      url: new URL(
        "http://localhost:4321/login/github/callback?code=test-code&state=test-state",
      ),
      cookies: {
        get: vi.fn(() => ({ value: "test-state" })),
      },
      redirect: vi.fn(() => new Response(null, { status: 302 })),
    };

    // Mock GitHub API response for rjhoppe
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve({ id: 123456, login: "rjhoppe" }),
    } as Response);

    // Act
    await callbackHandler(mockContext as any);

    // Assert
    expect(mockContext.redirect).toHaveBeenCalledWith("/");
    expect(vi.mocked(createSession)).toHaveBeenCalled();
    expect(vi.mocked(setSessionTokenCookie)).toHaveBeenCalled();
  });
});
