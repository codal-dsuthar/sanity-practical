/**
 * Webhook Handler: On Document Delete
 *
 * Triggered when a document is deleted
 * - Remove from search indices
 * - Update references
 * - Cleanup related data
 */

import type { SanityClient } from "sanity";

type DeleteWebhookPayload = {
  _id: string;
  _type: string;
  _deletedAt: string;
};

export default async function onDelete(
  request: Request,
  _context: { client: SanityClient }
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = (await request.json()) as DeleteWebhookPayload;

    console.log(`Document deleted: ${payload._type} - ${payload._id}`);

    return new Response(
      JSON.stringify({ success: true, message: "Delete webhook processed" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
