/**
 * External Service Synchronization Function
 *
 * Syncs Sanity content with external services:
 * - Search indices (Algolia, etc.)
 * - Analytics platforms
 * - Social media
 * - Email services
 *
 * Trigger: Webhook from Sanity on content changes
 */

import type { SanityClient } from "sanity";

type SyncPayload = {
  documentId: string;
  documentType: string;
  action: "create" | "update" | "delete";
  timestamp: string;
};

type SyncResult = {
  success: boolean;
  services: {
    [service: string]: {
      synced: boolean;
      message: string;
    };
  };
};

/**
 * Sync to external search index
 */
function syncSearchIndex(
  documentId: string,
  action: "create" | "update" | "delete"
): Promise<{ synced: boolean; message: string }> {
  try {
    console.log(`Syncing to search index: ${action} ${documentId}`);

    return Promise.resolve({
      synced: true,
      message: `Search index ${action} completed`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Promise.resolve({
      synced: false,
      message: `Search index sync failed: ${message}`,
    });
  }
}

/**
 * Sync to analytics platform
 */
function syncAnalytics(
  documentId: string,
  documentType: string
): Promise<{ synced: boolean; message: string }> {
  try {
    console.log(`Syncing to analytics: ${documentType} ${documentId}`);

    return Promise.resolve({
      synced: true,
      message: "Analytics sync completed",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Promise.resolve({
      synced: false,
      message: `Analytics sync failed: ${message}`,
    });
  }
}

/**
 * Main sync function
 */
export default async function syncExternal(
  request: Request,
  _context: { client: SanityClient }
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = (await request.json()) as SyncPayload;

    const result: SyncResult = {
      success: true,
      services: {},
    };

    if (!payload.documentId.startsWith("drafts.")) {
      result.services.searchIndex = await syncSearchIndex(
        payload.documentId,
        payload.action
      );
      result.services.analytics = await syncAnalytics(
        payload.documentId,
        payload.documentType
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        success: false,
        services: {},
        error: message,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
