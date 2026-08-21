import { useState, type PropsWithChildren } from 'react'
import { LearnerProfileContext } from './learnerProfileContext.ts'
import { ProfileDialog } from './ProfileDialog.tsx'
import {
  makeUserId,
  readProfile,
  writeProfile,
  type LearnerProfile,
} from './profileStorage.ts'

export function LearnerProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<LearnerProfile | null>(() =>
    readProfile(window.localStorage),
  )
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  function save(displayName: string) {
    try {
      setProfile(writeProfile(window.localStorage, displayName))
    } catch {
      setProfile({
        displayName: displayName.trim(),
        userId: makeUserId(displayName),
      })
    }

    setIsEditorOpen(false)
  }

  return (
    <LearnerProfileContext.Provider
      value={{
        profile,
        openProfileEditor: () => setIsEditorOpen(true),
      }}
    >
      {children}
      <ProfileDialog
        currentName={profile?.displayName ?? ''}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={save}
      />
    </LearnerProfileContext.Provider>
  )
}
