import Link from "next/link";
import { createDataAttribute } from "next-sanity";
import Avatar from "@/app/components/avatar";
import { sanityFetch } from "@/sanity/lib/live";
import { allPostsQuery, morePostsQuery } from "@/sanity/lib/queries";
import type { AllPostsQueryResult } from "@/sanity.types";
import DateComponent from "./date";
import Onboarding from "./onboarding";

const Post = ({ post }: { post: AllPostsQueryResult[number] }) => {
  const { _id, title, slug, excerpt, date, author } = post;

  const attr = createDataAttribute({
    id: _id,
    type: "post",
    path: "title",
  });

  return (
    <article
      className="relative flex flex-col justify-between rounded-sm border border-gray-200 bg-gray-50 p-6 transition-colors hover:bg-white"
      data-sanity={attr()}
      key={_id}
    >
      <Link
        className="underline transition-colors hover:text-brand"
        href={`/posts/${slug}`}
      >
        <span className="absolute inset-0 z-10" />
      </Link>
      <div>
        <h3 className="mb-4 font-bold text-2xl leading-tight">{title}</h3>

        <p className="line-clamp-3 max-w-[70ch] text-gray-600 text-sm leading-6">
          {excerpt}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between border-gray-100 border-t pt-4">
        {author?.firstName && author?.lastName && (
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
    <div className="space-y-6 pt-6">{children}</div>
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

  return (
    <Posts
      heading="Recent Posts"
      subHeading={`${data.length === 1 ? "This blog post is" : `These ${data.length} blog posts are`} populated from your Sanity Studio.`}
    >
      {data.map((post: AllPostsQueryResult[number]) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  );
};
