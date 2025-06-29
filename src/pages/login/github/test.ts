import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      message: "GitHub OAuth test route is working",
      timestamp: new Date().toISOString(),
      env: {
        PROD: import.meta.env.PROD,
        hasClientId: !!import.meta.env.GITHUB_CLIENT_ID,
        hasClientSecret: !!import.meta.env.GITHUB_CLIENT_SECRET,
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
