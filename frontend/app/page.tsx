import { Suspense } from "react";
import { AllPosts } from "@/app/components/posts";
import SearchPosts from "@/app/components/search-posts";
import { Hero } from "@/components/ui/hero";

export default async function Page() {
  return (
    <>
      <Hero
        content={{
          title: "Our Blog",
          titleHighlight: "Insights",
          description:
            "Thoughts, tutorials and updates from the team — focused on practical web dev.",
          primaryAction: { href: "/posts", text: "All posts" },
          secondaryAction: { href: "/about", text: "About" },
        }}
        pill={{ text: "Subscribe", href: "/subscribe", variant: "ghost" }}
      />

      <div className="border-gray-100 border-t bg-white">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <div className="mb-6">
              <SearchPosts />
            </div>
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
