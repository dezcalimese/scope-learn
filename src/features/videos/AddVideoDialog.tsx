import X from 'lucide-react/dist/esm/icons/x.mjs'
import { useEffect, useRef } from 'react'
import type { VideoFormValues } from '../../lib/validation/videoFormSchema.ts'
import { VideoForm } from './VideoForm.tsx'
import { useCreateVideo } from './useCreateVideo.ts'

interface AddVideoDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (videoId: string | null) => void
  userId: string | null
}

export function AddVideoDialog({
  isOpen,
  onClose,
  onCreated,
  userId,
}: AddVideoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const createVideo = useCreateVideo(userId)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      dialog.showModal()
      dialog.querySelector<HTMLInputElement>('#video-title')?.focus()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  async function submit(values: VideoFormValues) {
    const result = await createVideo.mutateAsync(values)
    onCreated(result.id)
  }

  return (
    <dialog
      aria-labelledby="add-video-title"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(38rem,calc(100%-2rem))] overflow-y-auto rounded-3xl bg-canvas p-0 text-ink shadow-2xl backdrop:bg-black/55"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-indigo-700">
              New lesson
            </p>
            <h2
              className="mt-2 text-3xl font-semibold tracking-[-0.035em]"
              id="add-video-title"
            >
              Add a video
            </h2>
            <p className="mt-2 leading-7 text-muted">
              Share one clear idea with your learning community.
            </p>
          </div>
          <button
            aria-label="Close add video dialog"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>
        <VideoForm
          isSubmitting={createVideo.isPending}
          onCancel={onClose}
          onSubmit={submit}
          serverError={
            createVideo.isError
              ? 'The video could not be added. Check the details and try again.'
              : undefined
          }
          userId={userId}
        />
      </div>
    </dialog>
  )
}
