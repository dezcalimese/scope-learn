import BookOpen from 'lucide-react/dist/esm/icons/book-open.mjs'
import Plus from 'lucide-react/dist/esm/icons/plus.mjs'
import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { AddVideoDialog } from '../features/videos/AddVideoDialog.tsx'
import { ProfileButton } from '../features/profile/ProfileButton.tsx'
import { appConfig } from '../lib/config/appConfig.ts'

export function AppShell() {
  const navigate = useNavigate()
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  function handleCreated(videoId: string | null) {
    setIsAddVideoOpen(false)

    if (videoId) {
      void navigate(`/watch/${encodeURIComponent(videoId)}`)
      return
    }

    setNotice('Video added to your library.')
  }

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
          <div className="flex items-center gap-2">
            <ProfileButton />
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-ink/88 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                setNotice(null)
                setIsAddVideoOpen(true)
              }}
              type="button"
            >
              <Plus aria-hidden="true" size={17} />
              <span className="hidden sm:inline">Add video</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>
      <main id="main-content">
        {notice ? (
          <p
            className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-xl"
            role="status"
          >
            {notice}
          </p>
        ) : null}
        <Outlet />
      </main>
      <AddVideoDialog
        isOpen={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
        onCreated={handleCreated}
        userId={appConfig.userId}
      />
    </div>
  )
}
