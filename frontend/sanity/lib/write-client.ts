import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/lib/api";

const writeToken = process.env.SANITY_API_WRITE_TOKEN;

if (!writeToken) {
  throw new Error(
    "Missing SANITY_API_WRITE_TOKEN - required for creating content"
  );
}

/**
 * Client with write permissions for creating/updating documents
 * Used in API routes for user submissions
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
});
