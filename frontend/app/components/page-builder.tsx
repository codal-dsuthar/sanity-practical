"use client";

import Link from "next/link";
import type { SanityDocument } from "next-sanity";
import { useOptimistic } from "next-sanity/hooks";

import BlockRenderer from "@/app/components/block-renderer";
import { studioUrl } from "@/sanity/lib/api";
import { dataAttr } from "@/sanity/lib/utils";
import type { GetPageQueryResult } from "@/sanity.types";

type PageBuilderPageProps = {
  page: GetPageQueryResult;
};

type PageBuilderSection = {
  _key: string;
  _type: string;
};

type PageBuilderBlock = PageBuilderSection & Record<string, unknown>;

type PageData = {
  _id: string;
  _type: string;
  pageBuilder?: PageBuilderBlock[];
};

/**
 * The PageBuilder component is used to render the blocks from the `pageBuilder` field in the Page type in your Sanity Studio.
 */

function renderSections(
  pageBuilderSections: PageBuilderBlock[],
  page: GetPageQueryResult
) {
  if (!page) {
    return null;
  }
  return (
    <div
      data-sanity={dataAttr({
        id: page._id,
        type: page._type,
        path: "pageBuilder",
      }).toString()}
    >
      {pageBuilderSections.map((block: PageBuilderBlock, index: number) => (
        <BlockRenderer
          block={block}
          index={index}
          key={block._key}
          pageId={page._id}
          pageType={page._type}
        />
      ))}
    </div>
  );
}

function renderEmptyState(page: GetPageQueryResult) {
  if (!page) {
    return null;
  }
  return (
    <div className="container">
      <h1 className="font-extrabold text-4xl text-gray-900 tracking-tight sm:text-5xl">
        This page has no content!
      </h1>
      <p className="mt-2 text-base text-gray-500">
        Open the page in Sanity Studio to add content.
      </p>
      <div className="mt-10 flex">
        <Link
          className="mr-6 flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white transition-colors duration-200 hover:bg-brand focus:bg-blue"
          href={`${studioUrl}/structure/intent/edit/template=page;type=page;path=pageBuilder;id=${page._id}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Add content to this page
        </Link>
      </div>
    </div>
  );
}

export default function PageBuilder({ page }: PageBuilderPageProps) {
  const pageBuilderSections = useOptimistic<
    PageBuilderBlock[] | undefined,
    SanityDocument<PageData>
  >(page?.pageBuilder || [], (currentSections, action) => {
    if (action.id !== page?._id) {
      return currentSections;
    }

    if (action.document.pageBuilder) {
      return action.document.pageBuilder.map(
        (section: PageBuilderBlock) =>
          currentSections?.find((s) => s._key === section?._key) || section
      );
    }

    return currentSections;
  });

  if (!page) {
    return renderEmptyState(page);
  }

  return pageBuilderSections && pageBuilderSections.length > 0
    ? renderSections(pageBuilderSections, page)
    : renderEmptyState(page);
}
