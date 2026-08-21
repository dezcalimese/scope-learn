import Play from 'lucide-react/dist/esm/icons/play.mjs'
import { appConfig } from '../../lib/config/appConfig.ts'

export function LibraryPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">
          Your learning space
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-6xl">
          Learn something worth sharing.
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted">
          Watch focused lessons, exchange useful ideas, and keep your learning
          library in one calm place.
        </p>
      </section>

      <section aria-labelledby="library-title" className="mt-14 sm:mt-18">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Library</p>
            <h2
              className="mt-1 text-2xl font-semibold tracking-[-0.025em]"
              id="library-title"
            >
              Continue learning
            </h2>
          </div>
        </div>

        <div className="mt-6 grid min-h-72 place-items-center rounded-3xl border border-dashed border-line bg-white/55 p-8 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid size-13 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
              <Play aria-hidden="true" fill="currentColor" size={20} />
            </span>
            <h3 className="mt-5 text-lg font-semibold">Foundation ready</h3>
            <p className="mt-2 leading-7 text-muted">
              Video loading arrives in the next phase. The app shell, routes,
              query cache, configuration, and API boundary are now in place.
            </p>
            {appConfig.userId === null ? (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Add your snake-case name to <code>VITE_USER_ID</code> before API
                write tests.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
