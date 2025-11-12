import Image from "next/image";
import type { PortableTextBlock } from "next-sanity";
import { Suspense } from "react";
import PortableText from "@/app/components/portable-text";
import ResolvedLink from "@/app/components/resolved-link";
import { urlForImage } from "@/sanity/lib/utils";
import type { Link as SanityLink } from "@/sanity.types";

export type ImageText = {
  _key?: string;
  _type?: string;
  image?: {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  } | null;
  imagePosition?: "left" | "right" | string | null;
  subheading?: string | null;
  heading?: string | null;
  content?: PortableTextBlock[] | null;
  buttonText?: string | null;
  link?: SanityLink | null;
};

type ImageTextProps = {
  block: ImageText;
  index?: number;
};

export default function ImageTextComponent({ block, index }: ImageTextProps) {
  const imageUrl = block?.image?.asset
    ? urlForImage(block.image)?.width(800).height(600).url()
    : null;

  const isImageLeft = block?.imagePosition === "left";

  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="container">
        <div
          className={`mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 ${isImageLeft ? "lg:grid-flow-col-dense" : ""}`}
        >
          <div
            className={`lg:pt-4 lg:pr-8 ${isImageLeft ? "lg:col-start-2" : ""}`}
          >
            <div className="lg:max-w-lg">
              {block?.subheading && (
                <span className="mb-2 block font-semibold text-base text-black uppercase leading-7">
                  {block.subheading}
                </span>
              )}
              {block?.heading && (
                <h2 className="mt-2 font-bold text-3xl text-black tracking-tight sm:text-4xl">
                  {block.heading}
                </h2>
              )}
              {block?.content && block.content.length > 0 && (
                <div className="mt-6 text-gray-600 text-lg leading-8">
                  <PortableText value={block.content as PortableTextBlock[]} />
                </div>
              )}
              {block?.buttonText && block?.link && (
                <Suspense fallback={null}>
                  <div className="mt-10">
                    <ResolvedLink
                      className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white transition-colors duration-200 hover:bg-gray-800 focus:bg-gray-800"
                      link={block.link}
                    >
                      {block.buttonText}
                    </ResolvedLink>
                  </div>
                </Suspense>
              )}
            </div>
          </div>
          {imageUrl && (
            <div className={`relative ${isImageLeft ? "lg:col-start-1" : ""}`}>
              <Image
                alt={block?.image?.alt || ""}
                className="md:-ml-4 w-full rounded-xl object-cover shadow-xl ring-1 ring-gray-400/10 sm:w-3xl lg:ml-0"
                height={600}
                priority={index === 0}
                src={imageUrl}
                width={800}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
