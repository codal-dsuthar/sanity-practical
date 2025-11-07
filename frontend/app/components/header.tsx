import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-0 z-50 flex h-20 items-center bg-white/90 backdrop-blur-sm">
      <div className="container px-2 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/">
            <span className="pl-2 font-semibold text-lg sm:text-2xl">Site</span>
          </Link>

          {/* Minimal header: keep empty space for future links */}
          <nav aria-hidden="true">
            <ul className="flex items-center gap-4" />
          </nav>
        </div>
      </div>
    </header>
  );
}
