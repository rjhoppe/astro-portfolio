import type { APIRoute } from "astro";
import { generateState } from "arctic";
import { github } from "@lib/server/oauth";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const state = generateState();
  const url = github.createAuthorizationURL(state, []);

  cookies.set("github_oauth_state", state, {
    path: "/",
    // Off for testing
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  return redirect(url.toString());
};
