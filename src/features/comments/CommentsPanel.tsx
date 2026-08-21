import CircleAlert from 'lucide-react/dist/esm/icons/circle-alert.mjs'
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle.mjs'
import { useLearnerProfile } from '../profile/useLearnerProfile.ts'
import { CommentForm } from './CommentForm.tsx'
import { CommentItem } from './CommentItem.tsx'
import { useComments, useCreateComment } from './commentQueries.ts'

export function CommentsPanel({ videoId }: { videoId: string }) {
  const { openProfileEditor, profile } = useLearnerProfile()
  const commentsQuery = useComments(videoId)
  const createComment = useCreateComment(videoId, profile?.userId ?? null)

  return (
    <aside
      aria-labelledby="discussion-title"
      className="rounded-3xl border border-line bg-white/65 p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">Discussion</p>
          <h2 className="mt-1 text-xl font-semibold" id="discussion-title">
            Learn together
          </h2>
        </div>
        <span className="grid size-10 place-items-center rounded-full bg-indigo-50 text-indigo-700">
          <MessageCircle aria-hidden="true" size={18} />
        </span>
      </div>

      <div className="mt-6">
        <CommentForm
          authorName={profile?.displayName ?? null}
          isSubmitting={createComment.isPending}
          onRequestProfile={openProfileEditor}
          onSubmit={async (content) => {
            await createComment.mutateAsync(content)
          }}
          serverError={
            createComment.isError
              ? 'Your comment could not be posted. Try again.'
              : undefined
          }
        />
      </div>

      <div className="mt-7 border-t border-line pt-6">
        {commentsQuery.isPending ? (
          <div
            aria-label="Loading comments"
            className="space-y-4"
            role="status"
          >
            <div className="h-16 animate-pulse rounded-2xl bg-black/6" />
            <div className="h-16 animate-pulse rounded-2xl bg-black/6" />
          </div>
        ) : commentsQuery.isError ? (
          <div
            className="flex gap-3 text-sm leading-6 text-red-800"
            role="alert"
          >
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={17}
            />
            <p>Comments could not be loaded.</p>
          </div>
        ) : commentsQuery.data.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            No comments yet. Start a useful discussion.
          </p>
        ) : (
          <ul>
            {commentsQuery.data.map((comment, index) => (
              <CommentItem
                comment={comment}
                key={comment.commentId ?? `${comment.userId}-${index}`}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
