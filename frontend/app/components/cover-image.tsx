import { getImageDimensions } from "@sanity/asset-utils";
import { stegaClean } from "@sanity/client/stega";
import Image from "next/image";
import type { ReactElement } from "react";
import { urlForImage } from "@/sanity/lib/utils";
import type { SanityImageCrop, SanityImageHotspot } from "../../sanity.types";

type SanityImageObject = {
  _type?: "image";
  asset?: { _ref: string; _type: "reference"; _weak?: boolean };
  alt?: string;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
  media?: unknown;
  metadataBase?: string;
};

type CoverImageProps = {
  image?: SanityImageObject | null;
  priority?: boolean;
};

export default function CoverImage(
  props: CoverImageProps
): ReactElement | null {
  const { image: source, priority } = props;

  const image = source?.asset?._ref
    ? (() => {
        const dims = getImageDimensions(
          source as Parameters<typeof getImageDimensions>[0]
        );
        return (
          <Image
            alt={stegaClean(source?.alt) || ""}
            className="h-auto w-full object-cover"
            height={dims.height}
            priority={priority}
            src={urlForImage(source)?.url() as string}
            width={dims.width}
          />
        );
      })()
    : null;

  return (
    // sleeker: lighter shadow for a flatter, more modern look
    <div className="w-full overflow-hidden rounded-xl shadow-sm">{image}</div>
  );
}
