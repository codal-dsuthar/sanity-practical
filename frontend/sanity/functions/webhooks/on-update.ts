/**
 * Webhook Handler: On Document Update
 *
 * Triggered when a document is updated (draft or published)
 * - Update caches
 * - Log changes
 * - Trigger validations
 */

import type { SanityClient } from "sanity";

type UpdateWebhookPayload = {
  _id: string;
  _type: string;
  _updatedAt: string;
  previousRevision?: string;
};

export default async function onUpdate(
  request: Request,
  _context: { client: SanityClient }
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = (await request.json()) as UpdateWebhookPayload;

    console.log(`Document updated: ${payload._type} - ${payload._id}`);

    // if (!payload._id.startsWith("drafts.")) {
    // }

    return new Response(
      JSON.stringify({ success: true, message: "Update webhook processed" }),
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
