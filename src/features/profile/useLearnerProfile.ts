import { useContext } from 'react'
import { LearnerProfileContext } from './learnerProfileContext.ts'

export function useLearnerProfile() {
  const context = useContext(LearnerProfileContext)

  if (!context) {
    throw new Error(
      'useLearnerProfile must be used inside LearnerProfileProvider.',
    )
  }

  return context
}
