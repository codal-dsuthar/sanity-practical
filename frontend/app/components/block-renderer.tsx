import React from "react";

import Cta from "@/app/components/Cta";
import Info from "@/app/components/InfoSection";
import { dataAttr } from "@/sanity/lib/utils";

type BlockType = {
  _type: string;
  _key: string;
};

type BlockProps = {
  index: number;
  block: BlockType;
  pageId: string;
  pageType: string;
};

type BlockComponentProps = {
  block: BlockType;
  index: number;
};

type BlocksType = {
  [key: string]: React.FC<BlockComponentProps>;
};

const Blocks: BlocksType = {
  callToAction: Cta,
  infoSection: Info,
};

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({
  block,
  index,
  pageId,
  pageType,
}: BlockProps) {
  if (typeof Blocks[block._type] !== "undefined") {
    return (
      <div
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
        key={block._key}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block,
          index,
        })}
      </div>
    );
  }
  return React.createElement(
    () => (
      <div className="w-full rounded bg-gray-100 p-20 text-center text-gray-500">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key }
  );
}
