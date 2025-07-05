import { GitHub } from "arctic";

// Validate required environment variables only in non-test environments
if (process.env.NODE_ENV !== "production") {
  if (!process.env.GITHUB_CLIENT_ID) {
    throw new Error("GITHUB_CLIENT_ID environment variable is required");
  }

  if (!process.env.GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_SECRET environment variable is required");
  }
}

// Use dynamic callback URL based on environment
const callbackUrl =
  process.env.NODE_ENV === "production"
    ? "https://rjhoppe.dev/login/github/callback"
    : "http://localhost:4321/login/github/callback";

// Only log in test environments
if (process.env.NODE_ENV !== "production") {
  console.log("OAuth configuration:", {
    hasClientId: !!process.env.GITHUB_CLIENT_ID,
    hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
    callbackUrl,
  });
}

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID || "test-client-id",
  process.env.GITHUB_CLIENT_SECRET || "test-client-secret",
  callbackUrl,
);
