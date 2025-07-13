import { db } from "@lib/server/db";
import { rateLimit } from "@lib/server/ratelimit";
import { giftsTable } from "@models/schema";
import type { Gift } from "@models/type";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const PUT: APIRoute = async ({ request }): Promise<Response> => {
  const isNotRateLimited = rateLimit(request);
  if (request.method === "PUT" && isNotRateLimited)
    try {
      // Parse the incoming JSON body
      const updates: Gift[] = await request.json();

      // Validate input
      if (!Array.isArray(updates) || updates.length === 0) {
        return new Response(
          JSON.stringify({
            error: "Invalid or empty update request",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      await db.transaction((tx) => {
        for (const update of updates) {
          const { id, ...updatesToApply } = update;
          if (!id || Object.keys(updatesToApply).length === 0) {
            throw new Error(`Invalid update for id: ${id}`);
          }

          tx.update(giftsTable)
            .set(updatesToApply)
            .where(eq(giftsTable.id, id))
            .run();
        }
      });

      // Return successful response
      return new Response(
        JSON.stringify({
          message: "Updates successful",
          updatedCount: updates.length,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Batch update error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return new Response(
        JSON.stringify({
          error: errorMessage,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  else {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
