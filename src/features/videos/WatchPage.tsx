import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.mjs'
import CircleAlert from 'lucide-react/dist/esm/icons/circle-alert.mjs'
import { Link, useParams } from 'react-router-dom'
import { VideoPlayer } from '../player/VideoPlayer.tsx'
import { useVideo } from './videoQueries.ts'

export function WatchPage() {
  const { videoId = '' } = useParams()
  const videoQuery = useVideo(videoId)

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
        to="/"
      >
        <ArrowLeft aria-hidden="true" size={17} />
        Back to library
      </Link>

      {videoQuery.isPending ? (
        <div
          aria-label="Loading lesson"
          className="mt-6 animate-pulse"
          role="status"
        >
          <div className="aspect-video rounded-3xl bg-black/10" />
          <div className="mt-8 h-8 w-2/3 rounded-full bg-black/10" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-black/6" />
        </div>
      ) : videoQuery.isError ? (
        <section className="mt-6 grid min-h-96 place-items-center rounded-3xl bg-white p-8 text-center">
          <div className="max-w-md">
            <CircleAlert
              aria-hidden="true"
              className="mx-auto text-indigo-700"
              size={28}
            />
            <h1 className="mt-5 text-2xl font-semibold">
              Lesson not available
            </h1>
            <p className="mt-3 leading-7 text-muted">
              This lesson could not be loaded. It may have moved or the service
              may be unavailable.
            </p>
          </div>
        </section>
      ) : (
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="min-w-0">
            <VideoPlayer
              title={videoQuery.data.title}
              url={videoQuery.data.videoUrl}
            />
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-indigo-700">
              Video lesson
            </p>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              {videoQuery.data.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              {videoQuery.data.description}
            </p>
          </article>
          <aside
            aria-labelledby="discussion-title"
            className="rounded-3xl border border-line bg-white/65 p-6"
          >
            <p className="text-sm font-medium text-muted">Discussion</p>
            <h2 className="mt-1 text-xl font-semibold" id="discussion-title">
              Learn together
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              Lesson comments arrive after the video creation flow.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
