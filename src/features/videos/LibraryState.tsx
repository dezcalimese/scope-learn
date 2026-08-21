import CircleAlert from 'lucide-react/dist/esm/icons/circle-alert.mjs'
import Library from 'lucide-react/dist/esm/icons/library.mjs'
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw.mjs'
import Settings from 'lucide-react/dist/esm/icons/settings.mjs'
import type { ReactNode } from 'react'

interface LibraryStateProps {
  action?: ReactNode
  description: string
  icon: ReactNode
  title: string
}

function LibraryState({ action, description, icon, title }: LibraryStateProps) {
  return (
    <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-line bg-white/55 p-8 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-13 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
          {icon}
        </span>
        <h3 className="mt-5 text-lg font-semibold">{title}</h3>
        <p className="mt-2 leading-7 text-muted">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  )
}

export function EmptyLibraryState() {
  return (
    <LibraryState
      description="Add the first focused lesson and start a new learning collection."
      icon={<Library aria-hidden="true" size={21} />}
      title="Your library is ready"
    />
  )
}

export function ConfigurationState() {
  return (
    <LibraryState
      description="Add your snake-case first and last name to VITE_USER_ID in the local .env file, then restart the app."
      icon={<Settings aria-hidden="true" size={21} />}
      title="Complete the local setup"
    />
  )
}

export function ErrorLibraryState({ retry }: { retry: () => void }) {
  return (
    <LibraryState
      action={
        <button
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={retry}
          type="button"
        >
          <RefreshCw aria-hidden="true" size={16} />
          Try again
        </button>
      }
      description="The video service did not respond. Check the connection and try again."
      icon={<CircleAlert aria-hidden="true" size={21} />}
      title="We could not load the library"
    />
  )
}
