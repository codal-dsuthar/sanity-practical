import PageBuilder from "@/app/components/page-builder";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery } from "@/sanity/lib/queries";
import type { GetPageQueryResult } from "@/sanity.types";

export default async function AboutPage() {
  const _res = await sanityFetch({
    query: getPageQuery,
    params: { slug: "about" },
  });
  const { data } = _res as { data: GetPageQueryResult | null };

  const page = data;

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-bold text-3xl">{data?.heading}</h1>
        <div className="mt-4">
          <PageBuilder page={page} />
        </div>
      </div>
    </div>
  );
}
