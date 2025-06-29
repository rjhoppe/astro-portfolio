import { GitHub } from "arctic";

// Validate required environment variables only in non-test environments
if (import.meta.env.MODE !== "test") {
  if (!import.meta.env.GITHUB_CLIENT_ID) {
    throw new Error("GITHUB_CLIENT_ID environment variable is required");
  }

  if (!import.meta.env.GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_SECRET environment variable is required");
  }
}

// Use dynamic callback URL based on environment
const callbackUrl = import.meta.env.PROD
  ? "https://rjhoppe.dev/login/github/callback"
  : "http://localhost:4321/login/github/callback";

// Only log in non-test environments
if (import.meta.env.MODE !== "test") {
  console.log("OAuth configuration:", {
    hasClientId: !!import.meta.env.GITHUB_CLIENT_ID,
    hasClientSecret: !!import.meta.env.GITHUB_CLIENT_SECRET,
    callbackUrl,
    isProd: import.meta.env.PROD,
  });
}

export const github = new GitHub(
  import.meta.env.GITHUB_CLIENT_ID || "test-client-id",
  import.meta.env.GITHUB_CLIENT_SECRET || "test-client-secret",
  callbackUrl,
);
