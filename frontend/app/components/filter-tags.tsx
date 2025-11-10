import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { sanityFetch } from "@/sanity/lib/live";
import { allTagsQuery } from "@/sanity/lib/queries";

export const FilterTags = async ({
  currentTag,
  currentFeatured,
}: {
  currentTag?: string;
  currentFeatured?: boolean;
}) => {
  const { data: tags } = await sanityFetch({ query: allTagsQuery });

  const validTags = useMemo(
    () => tags.filter((t): t is string => t != null),
    [tags]
  );

  if (!validTags || validTags.length === 0) {
    return null;
  }

  const buildUrl = (tag?: string, featured?: boolean) => {
    const params = new URLSearchParams();
    if (tag) {
      params.set("tag", tag);
    }
    if (featured) {
      params.set("featured", "true");
    }
    return `/posts${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-medium text-gray-600 text-sm">Filter by:</span>

      <Link href="/posts">
        <Badge
          className="cursor-pointer hover:bg-gray-100"
          variant={currentTag || currentFeatured ? "outline" : "default"}
        >
          All Posts
        </Badge>
      </Link>

      <Link href={buildUrl(undefined, true)}>
        <Badge
          className="cursor-pointer hover:bg-gray-100"
          variant={currentFeatured ? "default" : "outline"}
        >
          Featured
        </Badge>
      </Link>

      {validTags.map((tag) => (
        <Link href={buildUrl(tag)} key={tag}>
          <Badge
            className="cursor-pointer hover:bg-gray-100"
            variant={currentTag === tag ? "default" : "outline"}
          >
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
};
