import BookOpen from 'lucide-react/dist/esm/icons/book-open.mjs'
import Plus from 'lucide-react/dist/esm/icons/plus.mjs'
import { Link, Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <a
        className="sr-only rounded-md bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="border-b border-line/80 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            className="flex items-center gap-2.5 font-semibold tracking-[-0.02em]"
            to="/"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <BookOpen aria-hidden="true" size={18} strokeWidth={2.2} />
            </span>
            <span>Scope Learn</span>
          </Link>
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-ink/88 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            type="button"
          >
            <Plus aria-hidden="true" size={17} />
            <span className="hidden sm:inline">Add video</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  )
}
