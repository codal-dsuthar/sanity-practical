import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed z-50 h-20 inset-0 bg-white/90 flex items-center backdrop-blur-sm">
      <div className="container py-4 px-2 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/">
            <span className="text-lg sm:text-2xl pl-2 font-semibold">Site</span>
          </Link>

          {/* Minimal header: keep empty space for future links */}
          <nav aria-hidden>
            <ul className="flex items-center gap-4" />
          </nav>
        </div>
      </div>
    </header>
  )
}
