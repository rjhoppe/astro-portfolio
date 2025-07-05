import type { APIRoute } from "astro";
import { generateState } from "arctic";
import { github } from "@lib/server/oauth";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  try {
    // Only log in test environments
    if (process.env.NODE_ENV !== "production") {
      console.log("GitHub OAuth route called");
      console.log("Environment check:", {
        ENV: process.env.NODE_ENV,
        hasClientId: !!process.env.GITHUB_CLIENT_ID,
        hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
        clientIdLength: process.env.GITHUB_CLIENT_ID?.length || 0,
        clientSecretLength: process.env.GITHUB_CLIENT_SECRET?.length || 0,
        clientIdValue: process.env.GITHUB_CLIENT_ID || "undefined",
        clientSecretValue: process.env.GITHUB_CLIENT_SECRET
          ? "***"
          : "undefined",
      });
    }

    // Check if OAuth is properly configured (only in non-test environments)
    if (
      process.env.NODE_ENV !== "production" &&
      (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET)
    ) {
      console.error("GitHub OAuth credentials not configured");
      return new Response(
        "OAuth not configured - missing environment variables",
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        },
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Generating state...");
    }
    const state = generateState();
    if (process.env.NODE_ENV !== "production") {
      console.log("State generated:", state);
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Creating authorization URL...");
    }
    const url = github.createAuthorizationURL(state, []);
    if (process.env.NODE_ENV !== "production") {
      console.log("Authorization URL created:", url.toString());
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Setting cookie...");
    }
    cookies.set("github_oauth_state", state, {
      path: "/",
      // Off for testing
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("Redirecting to:", url.toString());
    }
    return redirect(url.toString());
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in GitHub OAuth route:", error);
      console.error(
        "Error name:",
        error instanceof Error ? error.name : "Unknown",
      );
      console.error(
        "Error message:",
        error instanceof Error ? error.message : "Unknown",
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack trace",
      );
    }
    return new Response(
      `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      },
    );
  }
};
