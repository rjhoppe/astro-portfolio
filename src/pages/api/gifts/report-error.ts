import type { APIRoute } from "astro";
import { Resend } from "resend";
import { rateLimit } from "@lib/server/ratelimit";

type IssueBody = {
  issue: string;
};

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const isNotRateLimited = rateLimit(request);
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isNotRateLimited) {
    return new Response(
      JSON.stringify({ message: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const data = (await request.json()) as IssueBody;
    const apiKey = process.env.RESEND_API_KEY;
    const resend = new Resend(apiKey);
    const email = process.env.EMAIL_ADDRESS;
    if (apiKey && email) {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "Gifts Page Issue",
        text: data.issue,
      });

      return new Response(
        JSON.stringify({
          message: "Issue report forwarded to Rick, thanks for submitting :)",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      return new Response(
        JSON.stringify({
          message:
            "Server configuration error: missing API key or email address.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: `Issue submitting error report: ${error}` }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
