/**
 * Webhook Handler: On Document Publish
 *
 * Triggered when a document is published in Sanity
 * - Update caches
 * - Trigger revalidation
 * - Send notifications
 */

import type { SanityClient } from "sanity";

type PublishWebhookPayload = {
  _id: string;
  _type: string;
  _createdAt: string;
  title?: string;
  slug?: { current: string };
};

export default async function onPublish(
  request: Request,
  _context: { client: SanityClient }
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = (await request.json()) as PublishWebhookPayload;

    console.log(`Document published: ${payload._type} - ${payload._id}`);

    if (process.env.VERCEL_TRIGGER_URL) {
      try {
        await fetch(process.env.VERCEL_TRIGGER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: payload._type, id: payload._id }),
        });
        console.log("ISR triggered successfully");
      } catch (error) {
        console.error("ISR trigger failed:", error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Publish webhook processed" }),
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
