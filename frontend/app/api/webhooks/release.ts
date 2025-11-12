/**
 * Release Webhook Handler
 *
 * Handles webhooks triggered by content releases
 * - Updates caches
 * - Triggers ISR revalidation
 * - Sends notifications
 */

import crypto from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";

type ReleaseWebhookPayload = {
  releaseId: string;
  documentIds?: string[];
  action: "publish" | "schedule" | "complete";
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const payload = JSON.parse(body) as ReleaseWebhookPayload;

    console.log("Release webhook received:", {
      releaseId: payload.releaseId,
      action: payload.action,
      documentsCount: payload.documentIds?.length || 0,
    });

    const signature = request.headers.get("x-sanity-webhook-signature");
    if (!verifyWebhookSignature(body, signature || "")) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    switch (payload.action) {
      case "publish":
        await handlePublish(payload);
        break;
      case "schedule":
        await handleSchedule(payload);
        break;
      case "complete":
        await handleComplete(payload);
        break;
      default:
        console.warn(
          "Release webhook received unknown action:",
          payload.action
        );
        break;
    }

    return NextResponse.json({
      success: true,
      message: `Release webhook processed: ${payload.action}`,
    });
  } catch (error) {
    console.error("Release webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Handle publish action - make release live
 */
async function handlePublish(payload: ReleaseWebhookPayload) {
  console.log("Publishing release:", payload.releaseId);

  if (payload.documentIds && payload.documentIds.length > 0) {
    await Promise.all(
      payload.documentIds.map((docId) =>
        revalidateDocument(docId).catch((err) =>
          console.error(`Failed to revalidate ${docId}:`, err)
        )
      )
    );
  }

  await revalidateDocument("home");

  await notifyTeam(`Release ${payload.releaseId} published`);
}

/**
 * Handle schedule action - prepare for future release
 */
async function handleSchedule(payload: ReleaseWebhookPayload) {
  console.log("Scheduling release:", payload.releaseId);

  await notifyTeam(`Release ${payload.releaseId} scheduled`);
}

/**
 * Handle complete action - finalize release
 */
async function handleComplete(payload: ReleaseWebhookPayload) {
  console.log("Completing release:", payload.releaseId);

  await notifyTeam(`Release ${payload.releaseId} completed`);
}

/**
 * Revalidate a specific document/page
 */
async function revalidateDocument(docId: string) {
  try {
    const response = await fetch(
      `${process.env.VERCEL_TRIGGER_URL || "http://localhost:3000"}/api/revalidate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Revalidation failed: ${response.statusText}`);
    }

    console.log(`Revalidated: ${docId}`);
  } catch (error) {
    console.error(`Failed to revalidate ${docId}:`, error);
  }
}

/**
 * Send notification to team
 */
async function notifyTeam(message: string) {
  console.log("Team notification:", message);

  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
    } catch (error) {
      console.error("Failed to send Slack notification:", error);
    }
  }
}

/**
 * Verify webhook signature (implement based on your signing method)
 */
function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return true;
  }

  if (!signature) {
    return false;
  }

  try {
    const sig = signature.startsWith("sha256=")
      ? signature.slice(7)
      : signature;

    const expectedHex = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("hex");

    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expectedHex, "hex");

    if (sigBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuf, expectedBuf);
  } catch (err) {
    console.error("Failed to verify webhook signature:", err);
    return false;
  }
}
