import type { Comment } from '../../lib/api/types.ts'

function formatAuthor(userId: string) {
  return userId
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getInitials(author: string) {
  return author
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
}

function formatDate(value?: string) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(date)
}

export function CommentItem({ comment }: { comment: Comment }) {
  const author = formatAuthor(comment.userId) || 'Learner'
  const date = formatDate(comment.createdAt)

  return (
    <li className="flex gap-3 border-t border-line/75 py-5 first:border-t-0 first:pt-0">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800"
      >
        {getInitials(author)}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-ink">{author}</p>
          {date ? <time className="text-xs text-muted">{date}</time> : null}
        </div>
        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-muted">
          {comment.content}
        </p>
      </div>
    </li>
  )
}
