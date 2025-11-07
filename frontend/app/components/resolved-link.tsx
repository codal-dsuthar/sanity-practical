import Link from "next/link";
import { linkResolver } from "@/sanity/lib/utils";
import type { Link as SanityLink } from "@/sanity.types";

type ResolvedLinkProps = {
  link?: SanityLink | null;
  children: React.ReactNode;
  className?: string;
};

export default function ResolvedLink({
  link,
  children,
  className,
}: ResolvedLinkProps) {
  if (!link) {
    return <>{children}</>;
  }

  const resolvedLink = linkResolver(link);

  if (typeof resolvedLink === "string") {
    return (
      <Link
        className={className}
        href={resolvedLink}
        rel={link?.openInNewTab ? "noopener noreferrer" : undefined}
        target={link?.openInNewTab ? "_blank" : undefined}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}
