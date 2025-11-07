"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";

type PostResult = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  date?: string;
  author?: { firstName?: string; lastName?: string } | null;
};

export default function SearchPosts() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<PostResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const id = useId();

  const performSearch = useCallback(
    async (query: string, signal?: AbortSignal): Promise<void> => {
      try {
        const res = await fetch(
          `/api/search/posts?q=${encodeURIComponent(query)}`,
          { signal }
        );
        if (!res.ok) {
          throw new Error(`Search request failed: ${res.status}`);
        }
        const payload = await res.json();
        setResults(payload.data ?? []);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err) || "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const trimmed = q.trim();

    if (trimmed === "") {
      setResults(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timer = setTimeout(() => {
      performSearch(trimmed, controller.signal);
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [q, performSearch]);

  return (
    <div className="w-full">
      <label className="mb-2 block font-medium" htmlFor={id}>
        Search posts
      </label>
      <div className="flex w-full gap-2">
        <input
          className="w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand"
          id={id}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or excerpt..."
          value={q}
        />
      </div>

      <div className="mt-4">
        {loading && <div className="text-gray-500 text-sm">Searching…</div>}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {results && (
          <div>
            <div className="mb-2 text-gray-600 text-sm">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </div>
            <div className="space-y-4">
              {results.map((p) => (
                <article
                  className="relative flex flex-col justify-between rounded-sm border border-gray-200 bg-white p-4"
                  key={p._id}
                >
                  <Link
                    className="font-bold text-lg underline hover:text-brand"
                    href={`/posts/${p.slug}`}
                  >
                    {p.title}
                  </Link>
                  {p.excerpt && (
                    <p className="mt-2 line-clamp-3 text-gray-600 text-sm">
                      {p.excerpt}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
                    <div>
                      {p.author?.firstName && p.author?.lastName && (
                        <span>
                          {p.author.firstName} {p.author.lastName}
                        </span>
                      )}
                    </div>
                    <time dateTime={p.date ?? undefined}>{p.date ?? ""}</time>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
