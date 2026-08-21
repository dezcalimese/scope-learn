import { appConfig } from '../../lib/config/appConfig.ts'
import { LibrarySkeleton } from './LibrarySkeleton.tsx'
import {
  ConfigurationState,
  EmptyLibraryState,
  ErrorLibraryState,
} from './LibraryState.tsx'
import { VideoCard } from './VideoCard.tsx'
import { useVideos } from './videoQueries.ts'

export function LibraryPage() {
  const videosQuery = useVideos(appConfig.userId)

  let libraryContent

  if (appConfig.userId === null) {
    libraryContent = <ConfigurationState />
  } else if (videosQuery.isPending) {
    libraryContent = <LibrarySkeleton />
  } else if (videosQuery.isError) {
    libraryContent = (
      <ErrorLibraryState retry={() => void videosQuery.refetch()} />
    )
  } else if (videosQuery.data.length === 0) {
    libraryContent = <EmptyLibraryState />
  } else {
    libraryContent = (
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {videosQuery.data.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
    )
  }

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

        <div className="mt-6">{libraryContent}</div>
      </section>
    </div>
  )
}
