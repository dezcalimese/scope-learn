import X from 'lucide-react/dist/esm/icons/x.mjs'
import { useEffect, useRef, useState, type FormEvent } from 'react'

interface ProfileDialogProps {
  currentName: string
  isOpen: boolean
  onClose: () => void
  onSave: (displayName: string) => void
}

export function ProfileDialog({
  currentName,
  isOpen,
  onClose,
  onSave,
}: ProfileDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState(currentName)
  const normalizedName = displayName.trim()

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      setDisplayName(currentName)
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [currentName, isOpen])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (normalizedName.length >= 2) {
      onSave(normalizedName)
    }
  }

  return (
    <dialog
      aria-labelledby="profile-dialog-title"
      className="m-auto w-[min(30rem,calc(100%-2rem))] rounded-3xl bg-canvas p-0 text-ink shadow-2xl backdrop:bg-black/55"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      <form className="p-6 sm:p-8" onSubmit={submit}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-indigo-700">
              Learner profile
            </p>
            <h2
              className="mt-2 text-3xl font-semibold tracking-[-0.035em]"
              id="profile-dialog-title"
            >
              What should we call you?
            </h2>
          </div>
          <button
            aria-label="Close profile dialog"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>
        <p className="mt-4 leading-7 text-muted">
          This name appears with your comments. It stays in this browser.
        </p>
        <label
          className="mt-6 block text-sm font-semibold"
          htmlFor="display-name"
        >
          Display name
        </label>
        <input
          autoComplete="nickname"
          autoFocus
          className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
          id="display-name"
          maxLength={50}
          onChange={(event) => setDisplayName(event.currentTarget.value)}
          placeholder="Alex Student"
          ref={inputRef}
          value={displayName}
        />
        <button
          className="mt-7 min-h-12 w-full rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
          disabled={normalizedName.length < 2}
          type="submit"
        >
          Save profile
        </button>
      </form>
    </dialog>
  )
}
