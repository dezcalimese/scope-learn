import LoaderCircle from 'lucide-react/dist/esm/icons/loader-circle.mjs'
import Send from 'lucide-react/dist/esm/icons/send.mjs'
import { useState, type FormEvent } from 'react'
import { commentSchema } from '../../lib/validation/commentSchema.ts'

interface CommentFormProps {
  authorName: string | null
  isSubmitting: boolean
  onRequestProfile: () => void
  onSubmit: (content: string) => Promise<void>
  serverError?: string
}

export function CommentForm({
  authorName,
  isSubmitting,
  onRequestProfile,
  onSubmit,
  serverError,
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = commentSchema.safeParse(content)

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Write a valid comment.')
      return
    }

    setError(null)
    await onSubmit(result.data)
    setContent('')
  }

  if (!authorName) {
    return (
      <div className="rounded-2xl bg-indigo-50 p-4">
        <p className="text-sm leading-6 text-indigo-950">
          Create a local learner profile before you join the discussion.
        </p>
        <button
          className="mt-3 min-h-11 rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white"
          onClick={onRequestProfile}
          type="button"
        >
          Set display name
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold" htmlFor="comment-content">
          Add to the discussion
        </label>
        <span className="text-xs text-muted">as {authorName}</span>
      </div>
      <textarea
        aria-describedby={error ? 'comment-error' : undefined}
        aria-invalid={Boolean(error)}
        className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-line bg-white p-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
        id="comment-content"
        maxLength={500}
        onChange={(event) => setContent(event.currentTarget.value)}
        placeholder="Share a useful thought or question…"
        value={content}
      />
      {error ? (
        <p className="mt-2 text-sm text-red-700" id="comment-error">
          {error}
        </p>
      ) : null}
      {serverError ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {serverError}
        </p>
      ) : null}
      <button
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
        ) : (
          <Send aria-hidden="true" size={16} />
        )}
        {isSubmitting ? 'Posting…' : 'Post comment'}
      </button>
    </form>
  )
}
