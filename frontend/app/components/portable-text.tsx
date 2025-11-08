/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";

import ResolvedLink from "@/app/components/resolved-link";

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      h1: ({ children, value: block }) => (
        <h1 className="group relative">
          {children}
          <a
            className="-ml-6 absolute top-0 bottom-0 left-0 flex items-center opacity-0 transition-opacity group-hover:opacity-100"
            href={`#${block?._key}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Permalink</title>
              <path
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </a>
        </h1>
      ),
      h2: ({ children, value: block }) => (
        <h2 className="group relative">
          {children}
          <a
            className="-ml-6 absolute top-0 bottom-0 left-0 flex items-center opacity-0 transition-opacity group-hover:opacity-100"
            href={`#${block?._key}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Permalink</title>
              <path
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </a>
        </h2>
      ),
    },
    marks: {
      link: ({ children, value: link }) => (
        <ResolvedLink link={link}>{children}</ResolvedLink>
      ),
    },
  };

  return (
    <div
      className={[
        "prose prose-lg mx-auto prose-img:rounded-xl prose-a:text-brand text-gray-800",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PortableText components={components} value={value} />
    </div>
  );
}
