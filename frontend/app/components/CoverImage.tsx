import { getImageDimensions } from "@sanity/asset-utils";
import { stegaClean } from "@sanity/client/stega";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";

interface CoverImageProps {
  image: any;
  priority?: boolean;
}

export default function CoverImage(props: CoverImageProps) {
  const { image: source, priority } = props;
  const image = source?.asset?._ref ? (
    <Image
      alt={stegaClean(source?.alt) || ""}
      className="object-cover"
      height={getImageDimensions(source).height}
      priority={priority}
      src={urlForImage(source)?.url() as string}
      width={getImageDimensions(source).width}
    />
  ) : null;

  return <div className="relative">{image}</div>;
}
