import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Pagination = ({
  currentPage,
  totalPages,
  tag,
  featured,
}: {
  currentPage: number;
  totalPages: number;
  tag?: string;
  featured?: boolean;
}) => {
  const buildUrl = (page: number): string => {
    const params = new URLSearchParams();
    if (tag) {
      params.set("tag", tag);
    }
    if (featured) {
      params.set("featured", "true");
    }
    params.set("page", page.toString());
    return `/posts?${params.toString()}`;
  };

  const pages: number[] = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  pages.push(1);

  if (showEllipsisStart) {
    pages.push(-1);
  }

  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (showEllipsisEnd) {
    pages.push(-2);
  }

  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link href={buildUrl(currentPage - 1)}>
          <Button size="sm" variant="outline">
            Previous
          </Button>
        </Link>
      )}

      {pages.map((page, idx) => {
        if (page < 0) {
          return (
            <span
              className="px-2 text-gray-500"
              key={`ellipsis-${page.toString()}-${idx}`}
            >
              ...
            </span>
          );
        }

        return (
          <Link href={buildUrl(page)} key={`page-${page}`}>
            <Button
              size="sm"
              variant={page === currentPage ? "default" : "outline"}
            >
              {page}
            </Button>
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link href={buildUrl(currentPage + 1)}>
          <Button size="sm" variant="outline">
            Next
          </Button>
        </Link>
      )}
    </nav>
  );
};
