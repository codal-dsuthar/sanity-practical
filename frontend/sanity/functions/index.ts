/**
 * Serverless Functions for Sanity CMS
 *
 * These functions handle server-side logic including:
 * - Content validation
 * - External service synchronization
 * - Webhook handling
 * - Data transformation
 *
 * Note: Deploy these functions using Sanity CLI: `sanity function deploy`
 */

export const functions = {
  validateContent: "validate-content",
  syncExternal: "sync-external",
  webhooks: {
    onPublish: "webhooks/on-publish",
    onUpdate: "webhooks/on-update",
    onDelete: "webhooks/on-delete",
  },
};

export default functions;
