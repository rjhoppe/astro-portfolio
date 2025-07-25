import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@lib/server/session";

import type { APIRoute } from "astro";
import type { OAuth2Tokens } from "arctic";
import { db } from "@lib/server/db";
import { eq } from "drizzle-orm";
import { github } from "@lib/server/oauth";
import { userTable } from "@models/schema";

export const GET: APIRoute = async (context) => {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("github_oauth_state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch (e) {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const githubUser = await githubUserResponse.json();
  const githubUserId = githubUser.id;
  const githubUsername = githubUser.login;

  if (githubUsername != "rjhoppe") {
    return context.redirect("/forbidden");
  }

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.githubId, githubUserId))
    .limit(1)
    .execute();

  if (existingUser.length > 0) {
    const user = existingUser[0];
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    setSessionTokenCookie(context, sessionToken, session.expiresAt);
    return context.redirect("/");
  }

  // TODO: Replace this with your own DB query.
  const [user] = await db
    .insert(userTable)
    .values({ githubId: githubUserId, username: githubUsername })
    .returning();

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(context, sessionToken, session.expiresAt);
  return context.redirect("/");
};
