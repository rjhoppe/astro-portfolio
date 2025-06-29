import { GitHub } from "arctic";

// Validate required environment variables
if (!import.meta.env.GITHUB_CLIENT_ID) {
  throw new Error("GITHUB_CLIENT_ID environment variable is required");
}

if (!import.meta.env.GITHUB_CLIENT_SECRET) {
  throw new Error("GITHUB_CLIENT_SECRET environment variable is required");
}

// Use dynamic callback URL based on environment
const callbackUrl = import.meta.env.PROD
  ? "https://rjhoppe.dev/login/github/callback"
  : "http://localhost:4321/login/github/callback";

console.log("OAuth configuration:", {
  hasClientId: !!import.meta.env.GITHUB_CLIENT_ID,
  hasClientSecret: !!import.meta.env.GITHUB_CLIENT_SECRET,
  callbackUrl,
  isProd: import.meta.env.PROD,
});

export const github = new GitHub(
  import.meta.env.GITHUB_CLIENT_ID,
  import.meta.env.GITHUB_CLIENT_SECRET,
  callbackUrl,
);
