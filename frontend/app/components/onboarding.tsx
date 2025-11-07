"use client";

import Link from "next/link";
import { studioUrl } from "@/sanity/lib/api";

export default function Onboarding() {
  return (
    <div className="mx-auto max-w-xl rounded-lg bg-gray-50 p-6 py-12 text-center text-gray-900">
      <h3 className="mb-2 font-medium text-lg">No content yet</h3>
      <p className="mb-4 text-gray-600 text-sm">
        Open the Sanity studio to create content.
      </p>
      <div>
        <Link
          className="inline-block rounded bg-black px-4 py-2 text-sm text-white"
          href={studioUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open Studio
        </Link>
      </div>
    </div>
  );
}

export function PageOnboarding() {
  return (
    <div className="mx-auto max-w-xl rounded-lg bg-gray-50 p-6 py-12 text-center text-gray-900">
      <h3 className="mb-2 font-medium text-lg">Page not found</h3>
      <p className="mb-4 text-gray-600 text-sm">
        Create this page in the Sanity studio.
      </p>
      <div>
        <Link
          className="inline-block rounded bg-black px-4 py-2 text-sm text-white"
          href={studioUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open Studio
        </Link>
      </div>
    </div>
  );
}
