import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-0 z-50 flex h-20 items-center bg-white/90 backdrop-blur-sm">
      <div className="container px-2 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/">
            <span className="pl-2 font-semibold text-lg sm:text-2xl">Site</span>
          </Link>

          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  className="text-gray-700 text-sm transition-colors hover:text-brand"
                  href="/posts"
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  className="rounded-md bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-brand/90"
                  href="/submit-post"
                >
                  Submit Post
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
