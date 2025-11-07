import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { Suspense } from "react";
import GetStartedCode from "@/app/components/get-started-code";
import { AllPosts } from "@/app/components/posts";
import SideBySideIcons from "@/app/components/side-by-side-icons";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";

export default async function Page() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

  return (
    <>
      <div className="relative">
        <div className="relative bg-[url(/images/tile-1-black.png)] bg-size-[5px]">
          <div className="absolute top-0 h-full w-full bg-linear-to-b from-white" />
          <div className="container">
            <div className="relative mx-auto flex min-h-[40vh] max-w-2xl flex-col items-center justify-center space-y-6 pt-10 pb-30 lg:max-w-4xl lg:px-12 xl:pt-20">
              <div className="flex flex-col items-center gap-4">
                <div className="prose bg-white px-3 py-1 font-mono text-md uppercase italic leading-6">
                  A starter template for
                </div>
                <h1 className="font-bold text-5xl text-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
                  <Link
                    className="underline decoration-brand underline-offset-8 transition-all ease-out hover:text-brand hover:underline-offset-4"
                    href="https://sanity.io/"
                  >
                    Sanity
                  </Link>
                  +
                  <Link
                    className="text-framework underline decoration-black underline-offset-8 transition-all ease-out hover:underline-offset-4"
                    href="https://nextjs.org/"
                  >
                    Next.js
                  </Link>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <SideBySideIcons />
          <div className="container relative mx-auto flex max-w-2xl flex-col items-center space-y-6 pt-10 pb-20 lg:max-w-4xl lg:px-12">
            <div className="prose sm:prose-lg md:prose-xl xl:prose-2xl text-center font-light prose-a:text-gray-700 text-gray-700">
              {settings?.description && (
                <PortableText value={settings.description} />
              )}
              <div className="flex flex-col items-center gap-4">
                <GetStartedCode />
                <Link
                  className="inline-flex text-brand text-xs underline hover:text-gray-900 md:text-sm"
                  href="https://www.sanity.io/docs"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Sanity Documentation
                  <svg
                    className="ml-1 inline h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Sanity docs</title>
                    <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V12L17.206 8.207L11.2071 14.2071L9.79289 12.7929L15.792 6.793L12 3H21Z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-gray-100 border-t bg-gray-50">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
