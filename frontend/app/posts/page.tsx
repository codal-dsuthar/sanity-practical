import { Suspense } from "react";
import { AllPosts } from "@/app/components/posts";
import SearchPosts from "@/app/components/search-posts";

export default async function PostsPage() {
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

        <Suspense>
          {/* AllPosts returns a component tree; await to render server-side */}
          {await AllPosts()}
        </Suspense>
      </div>
    </>
  );
}
