import UserRound from 'lucide-react/dist/esm/icons/user-round.mjs'
import { useLearnerProfile } from './useLearnerProfile.ts'

export function ProfileButton() {
  const { openProfileEditor, profile } = useLearnerProfile()
  const initial = profile?.displayName.trim().charAt(0).toUpperCase()

  return (
    <button
      aria-label={
        profile ? `Edit profile for ${profile.displayName}` : 'Set up profile'
      }
      className="grid size-11 place-items-center rounded-full border border-line bg-white/55 text-sm font-semibold transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={openProfileEditor}
      type="button"
    >
      {initial || <UserRound aria-hidden="true" size={18} />}
    </button>
  )
}
