'use client'

import Link from 'next/link'
import {studioUrl} from '@/sanity/lib/api'

export default function Onboarding() {
  return (
    <div className="max-w-xl mx-auto py-12 text-center bg-gray-50 text-gray-900 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-2">No content yet</h3>
      <p className="text-sm text-gray-600 mb-4">Open the Sanity studio to create content.</p>
      <div>
        <Link
          href={studioUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded bg-black text-white py-2 px-4 text-sm"
        >
          Open Studio
        </Link>
      </div>
    </div>
  )
}

export function PageOnboarding() {
  return (
    <div className="max-w-xl mx-auto py-12 text-center bg-gray-50 text-gray-900 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-2">Page not found</h3>
      <p className="text-sm text-gray-600 mb-4">Create this page in the Sanity studio.</p>
      <div>
        <Link
          href={studioUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded bg-black text-white py-2 px-4 text-sm"
        >
          Open Studio
        </Link>
      </div>
    </div>
  )
}
