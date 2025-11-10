import Link from "next/link";
import { createDataAttribute } from "next-sanity";
import Avatar from "@/app/components/avatar";
import { sanityFetch } from "@/sanity/lib/live";
import {
  allPostsQuery,
  morePostsQuery,
  paginatedPostsQuery,
  postCountQuery,
} from "@/sanity/lib/queries";
import type { AllPostsQueryResult } from "@/sanity.types";
import DateComponent from "./date";
import Onboarding from "./onboarding";
import { Pagination } from "./pagination";

const Post = ({ post }: { post: AllPostsQueryResult[number] }) => {
  const { _id, title, slug, excerpt, date, author } = post;

  const attr = createDataAttribute({
    id: _id,
    type: "post",
    path: "title",
  });

  const hasAuthorName =
    author?.firstName || author?.lastName || author.username;

  return (
    <article
      className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow"
      data-sanity={attr()}
      key={_id}
    >
      <Link className="absolute inset-0 z-10" href={`/posts/${slug}`} />
      <div>
        <h3 className="mb-4 font-bold text-2xl leading-tight transition-colors group-hover:text-brand">
          {title}
        </h3>

        <p className="line-clamp-3 max-w-[70ch] text-base text-gray-700 leading-7">
          {excerpt}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between border-gray-100 border-t pt-4">
        {hasAuthorName && (
          <div className="flex items-center">
            <Avatar person={author} small={true} />
          </div>
        )}
        <time className="font-mono text-gray-500 text-xs" dateTime={date}>
          <DateComponent dateString={date} />
        </time>
      </div>
    </article>
  );
};

const Posts = ({
  children,
  heading,
  subHeading,
}: {
  children: React.ReactNode;
  heading?: string;
  subHeading?: string;
}) => (
  <div>
    {heading && (
      <h2 className="font-bold text-3xl text-gray-900 tracking-tight sm:text-4xl lg:text-5xl">
        {heading}
      </h2>
    )}
    {subHeading && (
      <p className="mt-2 text-gray-600 text-lg leading-8">{subHeading}</p>
    )}
    <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  </div>
);

export const MorePosts = async ({
  skip,
  limit,
}: {
  skip: string;
  limit: number;
}) => {
  const { data } = await sanityFetch({
    query: morePostsQuery,
    params: { skip, limit },
  });

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Posts heading={`Recent Posts (${data?.length})`}>
      {data?.map((post: AllPostsQueryResult[number]) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  );
};

export const AllPosts = async () => {
  const { data } = await sanityFetch({ query: allPostsQuery });

  if (!data || data.length === 0) {
    return <Onboarding />;
  }

  const subHeading =
    data.length === 1 ? "Latest post." : `Latest ${data.length} posts.`;

  return (
    <Posts heading="Recent Posts" subHeading={subHeading}>
      {data.map((post: AllPostsQueryResult[number]) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  );
};

export const FilteredPosts = async ({
  tag,
  featured,
  page = 1,
}: {
  tag?: string;
  featured?: boolean;
  page?: number;
}) => {
  const POSTS_PER_PAGE = 9;
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  // Always pass parameters, but use null instead of undefined for GROQ
  const normalizeParams = (params: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ])
    );

  const [{ data: posts }, { data: totalCount }] = await Promise.all([
    sanityFetch({
      query: paginatedPostsQuery,
      params: normalizeParams({ tag, featured, start, end }),
    }),
    sanityFetch({
      query: postCountQuery,
      params: normalizeParams({ tag, featured }),
    }),
  ]);

  if (!posts || posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">No posts found matching your filters.</p>
      </div>
    );
  }

  const totalPages = Math.ceil((totalCount || 0) / POSTS_PER_PAGE);

  // Compute heading without nested ternary
  let headingText = "All Posts";
  if (tag) {
    headingText = `Posts tagged "${tag}"`;
  } else if (featured) {
    headingText = "Featured Posts";
  }

  return (
    <div>
      <Posts
        heading={headingText}
        subHeading={`Showing ${posts.length} of ${totalCount} posts`}
      >
        {posts.map((post: AllPostsQueryResult[number]) => (
          <Post key={post._id} post={post} />
        ))}
      </Posts>
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            featured={featured}
            tag={tag}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};
