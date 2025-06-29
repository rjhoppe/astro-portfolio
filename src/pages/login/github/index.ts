import type { APIRoute } from "astro";
import { generateState } from "arctic";
import { github } from "@lib/server/oauth";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  try {
    console.log("GitHub OAuth route called");
    console.log("Environment check:", {
      PROD: import.meta.env.PROD,
      hasClientId: !!import.meta.env.GITHUB_CLIENT_ID,
      hasClientSecret: !!import.meta.env.GITHUB_CLIENT_SECRET,
      clientIdLength: import.meta.env.GITHUB_CLIENT_ID?.length || 0,
      clientSecretLength: import.meta.env.GITHUB_CLIENT_SECRET?.length || 0,
    });

    // Check if OAuth is properly configured
    if (
      !import.meta.env.GITHUB_CLIENT_ID ||
      !import.meta.env.GITHUB_CLIENT_SECRET
    ) {
      console.error("GitHub OAuth credentials not configured");
      return new Response("OAuth not configured", { status: 500 });
    }

    console.log("Generating state...");
    const state = generateState();
    console.log("State generated:", state);

    console.log("Creating authorization URL...");
    const url = github.createAuthorizationURL(state, []);
    console.log("Authorization URL created:", url.toString());

    console.log("Setting cookie...");
    cookies.set("github_oauth_state", state, {
      path: "/",
      // Off for testing
      secure: import.meta.env.PROD,
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });

    console.log("Redirecting to:", url.toString());
    return redirect(url.toString());
  } catch (error) {
    console.error("Error in GitHub OAuth route:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    return new Response("Internal server error", { status: 500 });
  }
};
