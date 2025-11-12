import React from "react";

import Cta from "@/app/components/cta";
import FeaturesGrid, {
  type FeaturesGrid as FeaturesGridType,
} from "@/app/components/features-grid";
import ImageText, {
  type ImageText as ImageTextType,
} from "@/app/components/image-text";
import Info from "@/app/components/info-section";
import { dataAttr } from "@/sanity/lib/utils";
import type { CallToAction, InfoSection } from "@/sanity.types";

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

const CtaAdapter: React.FC<BlockComponentProps> = ({ block, index }) => (
  <Cta block={block as unknown as CallToAction} index={index} />
);

const InfoAdapter: React.FC<BlockComponentProps> = ({ block, index }) => (
  <Info block={block as unknown as InfoSection} index={index} />
);

const FeaturesGridAdapter: React.FC<BlockComponentProps> = ({
  block,
  index,
}) => (
  <FeaturesGrid block={block as unknown as FeaturesGridType} index={index} />
);

const ImageTextAdapter: React.FC<BlockComponentProps> = ({ block, index }) => (
  <ImageText block={block as unknown as ImageTextType} index={index} />
);

const Blocks: BlocksType = {
  callToAction: CtaAdapter,
  infoSection: InfoAdapter,
  featuresGrid: FeaturesGridAdapter,
  imageText: ImageTextAdapter,
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
