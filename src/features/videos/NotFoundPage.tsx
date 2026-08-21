import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.mjs'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto grid min-h-[70dvh] max-w-xl place-items-center px-5 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
          This lesson is not here.
        </h1>
        <p className="mt-4 leading-7 text-muted">
          Return to the library and choose another place to continue.
        </p>
        <Link
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white"
          to="/"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Back to library
        </Link>
      </div>
    </section>
  )
}
