import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const password = url.searchParams.get("password");
  const pageSecret =
    typeof process !== "undefined" && process.env?.PUBLIC_GIFTS_PASSWORD
      ? process.env.PUBLIC_GIFTS_PASSWORD
      : // : "your-pw-here-for-local"
        import.meta.env?.PUBLIC_GIFTS_PASSWORD;

  if (password !== pageSecret) {
    return new Response(JSON.stringify({ authorized: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ authorized: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
