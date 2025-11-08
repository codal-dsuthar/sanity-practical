import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "next-sanity";
import { Suspense } from "react";

import Avatar from "@/app/components/avatar";
import CoverImage from "@/app/components/cover-image";
import PortableText from "@/app/components/portable-text";
import { MorePosts } from "@/app/components/posts";
import { sanityFetch } from "@/sanity/lib/live";
import { postPagesSlugs, postQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

const WHITESPACE_REGEX = /\s+/g;

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: postPagesSlugs,
    perspective: "published",
    stega: false,
  });
  return data;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { data: post } = await sanityFetch({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{ name: `${post.author.firstName} ${post.author.lastName}` }]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const [{ data: post }] = await Promise.all([
    sanityFetch({ query: postQuery, params }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  // Estimate reading time (words / 200 wpm)
  const contentText = Array.isArray(post.content)
    ? (post.content as PortableTextBlock[])
        .map((b) => (typeof b === "string" ? b : JSON.stringify(b)))
        .join(" ")
    : "";
  const words = contentText.split(WHITESPACE_REGEX).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  return (
    <>
      <div className="">
        <div className="container my-12 grid gap-12 lg:my-24">
          <div>
            <div className="mb-6 grid gap-6 border-gray-100 border-b pb-6">
              <div className="flex max-w-3xl flex-col gap-6">
                <h2 className="font-extrabold text-4xl text-gray-900 leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  {post.title}
                </h2>
              </div>
              <div className="flex max-w-3xl items-center gap-4 text-gray-500 text-sm">
                {post.author?.firstName && post.author?.lastName && (
                  <Avatar date={post.date} person={post.author} />
                )}
                <div className="ml-1">{readingTime} min read</div>
              </div>
            </div>
            <article className="mx-auto grid max-w-3xl gap-6">
              <div className="">
                {post?.coverImage && (
                  <CoverImage image={post.coverImage} priority />
                )}
              </div>
              {Array.isArray(post.content) &&
                (post.content as PortableTextBlock[]).length > 0 && (
                  <PortableText
                    className="max-w-2xl"
                    value={post.content as PortableTextBlock[]}
                  />
                )}
            </article>
          </div>
        </div>
      </div>
      <div className="border-gray-100 border-t bg-gray-50">
        <div className="container grid gap-12 py-12 lg:py-24">
          <aside>
            <Suspense>{await MorePosts({ skip: post._id, limit: 2 })}</Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
