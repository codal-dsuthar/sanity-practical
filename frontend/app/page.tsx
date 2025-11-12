import { Suspense } from "react";
import PageBuilder from "@/app/components/page-builder";
import { AllPosts } from "@/app/components/posts";
import SearchPosts from "@/app/components/search-posts";
import { Hero } from "@/components/ui/hero";
import { sanityFetch } from "@/sanity/lib/live";
import { homeQuery } from "@/sanity/lib/queries";
import type { GetPageQueryResult } from "@/sanity.types";

export default async function Page() {
  const _res = await sanityFetch({
    query: homeQuery,
  });
  const { data } = _res as { data: unknown | null };
  const dataRecord = data as Record<string, unknown> | null;

  return (
    <>
      <Hero
        content={{
          title: (dataRecord?.heroTitle as string) || "Our Blog",
          titleHighlight:
            (dataRecord?.heroTitleHighlight as string) || "Insights",
          description:
            (dataRecord?.heroDescription as string) ||
            "Thoughts, tutorials and updates from the team — focused on practical web dev.",
          primaryAction: ((dataRecord?.heroPrimaryAction as unknown as {
            href?: string;
            text?: string;
          }) || {
            href: "/posts",
            text: "All posts",
          }) as { href: string; text: string; icon?: React.ReactNode },
          secondaryAction: ((dataRecord?.heroSecondaryAction as unknown as {
            href?: string;
            text?: string;
          }) || {
            href: "/about",
            text: "About",
          }) as { href: string; text: string; icon?: React.ReactNode },
        }}
        pill={
          ((dataRecord?.heroPill as unknown as {
            text?: string;
            href?: string;
            variant?: string;
          }) || {
            text: "Subscribe",
            href: "/subscribe",
            variant: "ghost",
          }) as {
            href?: string | undefined;
            text: string;
            icon?: React.ReactNode;
            endIcon?: React.ReactNode;
            variant?: "default" | "outline" | "ghost" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            className?: string | undefined;
          }
        }
      />

      {dataRecord?.pageBuilder &&
        (dataRecord.pageBuilder as unknown[]).length > 0 && (
          <div className="bg-white">
            <PageBuilder page={data as GetPageQueryResult} />
          </div>
        )}

      {(dataRecord?.showPostsSection as boolean | undefined) !== false && (
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
      )}
    </>
  );
}
