/**
 * Content Validation Serverless Function
 *
 * Validates content against schema requirements before publishing
 * - Checks required fields
 * - Validates data types
 * - Enforces business rules
 *
 * Trigger: Can be called from frontend or Studio via HTTP endpoint
 * @returns {Promise<{valid: boolean, errors: string[]}>}
 */

import type { SanityClient } from "sanity";

type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

type ContentPayload = {
  _id: string;
  _type: string;
  title?: string;
  slug?: { current?: string } | null;
  author?: unknown;
  publishDate?: string | null;
  body?: unknown[];
  [key: string]: unknown;
};

/**
 * Validates post content for required fields and structure
 */
function validatePost(content: ContentPayload): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!content.title || content.title.trim().length === 0) {
    errors.push("Post must have a title");
  }

  if (!content.slug?.current) {
    errors.push("Post must have a unique slug");
  }

  if (!content.author) {
    warnings.push("Post should have an author assigned");
  }

  if (!content.publishDate) {
    warnings.push("Consider adding a publish date");
  }

  if (
    content.body &&
    Array.isArray(content.body) &&
    content.body.length === 0
  ) {
    warnings.push("Post body is empty");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates page content
 */
function validatePage(content: ContentPayload): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!content.title || content.title.trim().length === 0) {
    errors.push("Page must have a title");
  }

  if (!content.slug?.current) {
    errors.push("Page must have a unique slug");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Main validation function
 */
export default async function validateContent(
  request: Request,
  _context: { client: SanityClient }
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = (await request.json()) as ContentPayload;

    let result: ValidationResult;

    switch (payload._type) {
      case "post":
        result = validatePost(payload);
        break;
      case "page":
        result = validatePage(payload);
        break;
      default:
        result = {
          valid: true,
          errors: [],
          warnings: [],
        };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        valid: false,
        errors: [`Validation error: ${message}`],
        warnings: [],
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
