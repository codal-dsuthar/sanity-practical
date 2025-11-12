import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-0 z-50 flex h-20 items-center bg-white/90 backdrop-blur-sm">
      <div className="container px-2 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/">
            <span className="brand pl-2 font-semibold">Site</span>
          </Link>

          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link className="muted" href="/posts">
                  Posts
                </Link>
              </li>
              <li>
                <Link className="btn btn-primary" href="/submit-post">
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
