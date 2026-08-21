import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import Play from 'lucide-react/dist/esm/icons/play.mjs'
import { Link } from 'react-router-dom'
import type { Video } from '../../lib/api/types.ts'

const previewThemes = [
  'from-indigo-600 via-indigo-500 to-violet-400',
  'from-emerald-700 via-emerald-600 to-teal-400',
  'from-amber-600 via-orange-500 to-rose-400',
  'from-slate-800 via-slate-700 to-indigo-500',
] as const

function getTheme(videoId: string) {
  let total = 0

  for (const character of videoId) {
    total += character.charCodeAt(0)
  }

  return previewThemes[total % previewThemes.length]
}

function getInitial(title: string) {
  return title.trim().charAt(0).toUpperCase() || 'L'
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="group min-w-0">
      <Link
        aria-label={`Watch ${video.title}`}
        className="block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
        to={`/watch/${encodeURIComponent(video.videoId)}`}
      >
        <div
          className={`relative aspect-video overflow-hidden rounded-3xl bg-gradient-to-br ${getTheme(video.videoId)} p-5 shadow-[0_16px_40px_-24px_rgba(28,25,55,0.6)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_48px_-20px_rgba(28,25,55,0.65)]`}
        >
          <div className="absolute -right-10 -top-16 size-48 rounded-full border border-white/20" />
          <div className="absolute -bottom-20 -left-6 size-52 rounded-full bg-white/10 blur-sm" />
          <span className="relative text-7xl font-semibold tracking-[-0.08em] text-white/20 sm:text-8xl">
            {getInitial(video.title)}
          </span>
          <span className="absolute bottom-5 left-5 grid size-11 place-items-center rounded-full bg-white text-ink shadow-lg transition group-hover:scale-105">
            <Play aria-hidden="true" fill="currentColor" size={17} />
          </span>
          <span className="absolute right-5 top-5 rounded-full border border-white/25 bg-black/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            Video lesson
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 px-1 pt-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-[-0.02em] text-ink">
              {video.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">
              {video.description || 'Open this lesson to learn more.'}
            </p>
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            size={19}
          />
        </div>
      </Link>
    </article>
  )
}
