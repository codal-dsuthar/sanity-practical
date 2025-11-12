/**
 * Custom GROQ Functions & Query Templates
 *
 * Provides reusable, modular GROQ query builders for:
 * - Common fragments
 * - Query builders
 * - Field selectors
 * - Filter utilities
 *
 * Benefits:
 * - DRY principle (Don't Repeat Yourself)
 * - Type-safe queries
 * - Easier maintenance and updates
 * - Consistent data structure across app
 */

// Common field selectors as reusable fragments
const authorFragment = `{
  _id,
  username,
  firstName,
  lastName,
  "picture": headshotImage,
  email,
  bio
}`;

const categoryFragment = `{
  _id,
  title,
  "slug": slug.current,
  description,
  icon
}`;

const postBaseFragment = `{
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  "excerpt": summary,
  "date": coalesce(publishDate, _updatedAt),
  featured,
  tags
}`;

const postFullFragment = `{
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  "excerpt": summary,
  "coverImage": relatedImage,
  "date": coalesce(publishDate, _updatedAt),
  "author": author->${authorFragment},
  tags,
  "categories": categories[]->{
    _id,
    title,
    "slug": slug.current
  },
  featured
}`;

const pageFullFragment = `{
  _id,
  title,
  "slug": slug.current,
  description,
  "pageBuilder": pageBuilder[],
  _updatedAt
}`;

const linkFragment = `{
  _type,
  title,
  url,
  external,
  ..._type == "link" && {
    "page": page->slug.current,
    "post": post->slug.current
  }
}`;

export const fragments = {
  author: authorFragment,
  postBase: postBaseFragment,
  postFull: postFullFragment,
  category: categoryFragment,
  pageFull: pageFullFragment,
  link: linkFragment,
} as const;

// Query builders for complex queries
export const queries = {
  /**
   * Build a query to fetch posts with optional filtering
   */
  getPosts: (options?: {
    featured?: boolean;
    category?: string;
    author?: string;
    limit?: number;
    offset?: number;
  }) => {
    let query = `*[_type == "post" && !(_id in path("drafts.**"))]`;

    if (options?.featured) {
      query += " && featured == true";
    }

    if (options?.category) {
      query += ` && "${options.category}" in categories[]->slug.current`;
    }

    if (options?.author) {
      query += ` && author->username == "${options.author}"`;
    }

    query += " | order(publishDate desc)";

    if (options?.limit) {
      const offset = options?.offset || 0;
      query += `[${offset}...${offset + options.limit}]`;
    }

    query += ` ${fragments.postFull}`;
    return query;
  },

  /**
   * Get a single post by slug
   */
  getPostBySlug: (slug: string) =>
    `*[_type == "post" && slug.current == "${slug}" && !(_id in path("drafts.**"))][0] ${fragments.postFull}`,

  /**
   * Get a page by slug
   */
  getPageBySlug: (slug: string) =>
    `*[_type == "page" && slug.current == "${slug}"][0] ${fragments.pageFull}`,

  /**
   * Get all categories
   */
  getCategories: () =>
    `*[_type == "category"] | order(title asc) ${fragments.category}`,

  /**
   * Get posts by category
   */
  getPostsByCategory: (categorySlug: string, limit = 10) =>
    `*[_type == "post" && "${categorySlug}" in categories[]->slug.current && !(_id in path("drafts.**"))] | order(publishDate desc)[0...${limit}] ${fragments.postFull}`,

  /**
   * Get related posts (same category or tags)
   */
  getRelatedPosts: (currentPostId: string, limit = 3) =>
    `*[_type == "post" && _id != "${currentPostId}" && !(_id in path("drafts.**"))] {
      ...,
      "relevance": length((categories[]->slug.current)[@ in ^.categories[]->slug.current]) + 
                   length(tags[@ in ^.tags])
    } | order(relevance desc, publishDate desc)[0...${limit}] ${fragments.postFull}`,

  /**
   * Get all authors
   */
  getAuthors: () =>
    `*[_type == "person"] | order(lastName asc, firstName asc) ${fragments.author}`,

  /**
   * Get featured posts
   */
  getFeaturedPosts: (limit = 5) =>
    `*[_type == "post" && featured == true && !(_id in path("drafts.**"))] | order(publishDate desc)[0...${limit}] ${fragments.postFull}`,
};

// Filter utilities for constructing WHERE clauses
export const filters = {
  /**
   * Filter documents by status
   */
  byStatus: (status: "draft" | "published" = "published") =>
    status === "published"
      ? `!(_id in path("drafts.**"))`
      : `_id in path("drafts.**")`,

  /**
   * Filter posts by date range
   */
  byDateRange: (fromDate: string, toDate: string) =>
    `publishDate >= "${fromDate}" && publishDate <= "${toDate}"`,

  /**
   * Filter posts by tags
   */
  byTags: (tags: string[]) =>
    `count(tags[@ in [${tags.map((t) => `"${t}"`).join(",")}]]) > 0`,

  /**
   * Filter posts with content
   */
  hasContent: () => "defined(body) && count(body) > 0",
};

// Aggregation functions for analytics
export const aggregations = {
  /**
   * Count posts by category
   */
  countByCategory: () =>
    `*[_type == "category"] {
      title,
      "slug": slug.current,
      "count": count(*[_type == "post" && this._id in categories[]._ref && !(_id in path("drafts.**"))])
    } | order(count desc)`,

  /**
   * Count posts by author
   */
  countByAuthor: () =>
    `*[_type == "person"] {
      firstName,
      lastName,
      username,
      "count": count(*[_type == "post" && author._ref == ^._id && !(_id in path("drafts.**"))])
    } | order(count desc)`,

  /**
   * Get most used tags
   */
  getMostUsedTags: () =>
    `*[_type == "post" && !(_id in path("drafts.**"))] {
      tags
    } | [0] | keys[] as $tag | {
      tag: $tag,
      "count": length(*[_type == "post" && this._id in path("drafts.**") == false && $tag in tags][])
    } | group() | sort(count desc)`,

  /**
   * Get post statistics
   */
  getPostStats: () =>
    `{
      "total": count(*[_type == "post" && !(_id in path("drafts.**"))]),
      "featured": count(*[_type == "post" && featured == true && !(_id in path("drafts.**"))]),
      "categories": count(*[_type == "category"]),
      "authors": count(*[_type == "person"])
    }`,
};

// Export all utilities
export default {
  fragments,
  queries,
  filters,
  aggregations,
};
