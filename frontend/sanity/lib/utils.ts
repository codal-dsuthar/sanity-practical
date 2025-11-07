import { getImageDimensions } from "@sanity/asset-utils";
import createImageUrlBuilder from "@sanity/image-url";
import {
  type CreateDataAttributeProps,
  createDataAttribute,
} from "next-sanity";
import { dataset, projectId, studioUrl } from "@/sanity/lib/api";
import type { Link, SanityImageCrop } from "@/sanity.types";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: unknown) => {
  if (!source || typeof source !== "object") {
    return;
  }

  const src = source as {
    asset?: { _ref?: string };
    crop?: SanityImageCrop;
  };

  if (!src.asset?._ref) {
    return;
  }

  const imageRef = src.asset._ref as string;
  const crop = src.crop;

  const { width, height } = getImageDimensions(imageRef);

  if (crop) {
    const {
      left: cLeft = 0,
      right = 0,
      top: cTop = 0,
      bottom: cBottom = 0,
    } = crop;

    const croppedWidth = Math.floor(width * (1 - (right + cLeft)));
    const croppedHeight = Math.floor(height * (1 - (cTop + cBottom)));

    const left = Math.floor(width * cLeft);
    const topPx = Math.floor(height * cTop);

    return imageBuilder
      ?.image(source)
      .rect(left, topPx, croppedWidth, croppedHeight)
      .auto("format");
  }

  return imageBuilder?.image(source).auto("format");
};

export function resolveOpenGraphImage(
  image: unknown,
  width = 1200,
  height = 627
) {
  if (!image) {
    return;
  }

  const builder = urlForImage(image);
  if (!builder) {
    return;
  }

  let url = builder.width(width).height(height).url();
  if (url) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set("fit", "crop");
      url = parsed.toString();
    } catch {
      console.warn("Failed to parse image URL for Open Graph image.");
    }
  }
  if (!url) {
    return;
  }

  const img = image as { alt?: string };
  return { url, alt: img.alt as string, width, height };
}

export function linkResolver(link: Link | undefined) {
  if (!link) {
    return null;
  }

  if (!link.linkType && link.href) {
    link.linkType = "href";
  }

  switch (link.linkType) {
    case "href":
      return link.href || null;
    case "page":
      if (link?.page && typeof link.page === "string") {
        return `/${link.page}`;
      }
      break;
    case "post":
      if (link?.post && typeof link.post === "string") {
        return `/posts/${link.post}`;
      }
      break;
    default:
      return null;
  }
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, "id" | "type" | "path">>;

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config);
}
