import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { token, writeToken } from "./token";

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: writeToken,
  browserToken: token,
});
