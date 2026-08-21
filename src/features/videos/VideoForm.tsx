import { zodResolver } from '@hookform/resolvers/zod'
import LoaderCircle from 'lucide-react/dist/esm/icons/loader-circle.mjs'
import { useForm } from 'react-hook-form'
import {
  videoFormSchema,
  type VideoFormValues,
} from '../../lib/validation/videoFormSchema.ts'

interface VideoFormProps {
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (values: VideoFormValues) => Promise<void>
  serverError?: string
  userId: string | null
}

const inputClassName =
  'mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-[0.95rem] text-ink outline-none transition placeholder:text-black/35 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100'

export function VideoForm({
  isSubmitting,
  onCancel,
  onSubmit,
  serverError,
  userId,
}: VideoFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      videoUrl: '',
    },
  })

  return (
    <form className="mt-7" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-semibold" htmlFor="video-title">
          Title
        </label>
        <input
          aria-describedby={errors.title ? 'video-title-error' : undefined}
          aria-invalid={Boolean(errors.title)}
          autoComplete="off"
          autoFocus
          className={inputClassName}
          id="video-title"
          maxLength={100}
          placeholder="How photosynthesis works"
          {...register('title')}
        />
        {errors.title ? (
          <p className="mt-2 text-sm text-red-700" id="video-title-error">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <label className="text-sm font-semibold" htmlFor="video-description">
          Description
        </label>
        <textarea
          aria-describedby={
            errors.description ? 'video-description-error' : undefined
          }
          aria-invalid={Boolean(errors.description)}
          className={`${inputClassName} min-h-28 resize-y py-3`}
          id="video-description"
          maxLength={600}
          placeholder="What will someone learn from this video?"
          {...register('description')}
        />
        {errors.description ? (
          <p className="mt-2 text-sm text-red-700" id="video-description-error">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <label className="text-sm font-semibold" htmlFor="video-url">
          Video URL
        </label>
        <input
          aria-describedby={
            errors.videoUrl ? 'video-url-error' : 'video-url-hint'
          }
          aria-invalid={Boolean(errors.videoUrl)}
          className={inputClassName}
          id="video-url"
          inputMode="url"
          placeholder="https://example.com/lesson.mp4"
          type="url"
          {...register('videoUrl')}
        />
        {errors.videoUrl ? (
          <p className="mt-2 text-sm text-red-700" id="video-url-error">
            {errors.videoUrl.message}
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-muted" id="video-url-hint">
            Use a direct MP4 or WebM URL for reliable playback.
          </p>
        )}
      </div>

      {userId === null ? (
        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Set your snake-case name in <code>VITE_USER_ID</code> before you add a
          lesson.
        </p>
      ) : null}

      {serverError ? (
        <p
          className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          className="min-h-12 rounded-full border border-line px-5 text-sm font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/88 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting || userId === null}
          type="submit"
        >
          {isSubmitting ? (
            <LoaderCircle
              aria-hidden="true"
              className="animate-spin"
              size={17}
            />
          ) : null}
          {isSubmitting ? 'Adding video…' : 'Add video'}
        </button>
      </div>
    </form>
  )
}
