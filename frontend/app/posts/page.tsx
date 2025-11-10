import { Suspense } from "react";
import { FilterTags } from "@/app/components/filter-tags";
import { FilteredPosts } from "@/app/components/posts";
import SearchPosts from "@/app/components/search-posts";

type Props = {
  searchParams: Promise<{ tag?: string; featured?: string; page?: string }>;
};

export default async function PostsPage(props: Props) {
  const searchParams = await props.searchParams;
  const tag = searchParams.tag;
  const featured = searchParams.featured === "true" ? true : undefined;
  const page = Number.parseInt(searchParams.page || "1", 10);

  return (
    <>
      <div className="container py-12">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="font-bold text-4xl">All Posts</h1>
          <p className="mt-4 text-muted-foreground">
            Browse our archive of posts.
          </p>
        </header>
      </div>

      <div className="container">
        <div className="mb-6">
          <SearchPosts />
        </div>

        <div className="mb-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            {await FilterTags({ currentTag: tag, currentFeatured: featured })}
          </Suspense>
        </div>

        <Suspense fallback={<div>Loading posts...</div>}>
          {await FilteredPosts({ tag, featured, page })}
        </Suspense>
      </div>
    </>
  );
}
