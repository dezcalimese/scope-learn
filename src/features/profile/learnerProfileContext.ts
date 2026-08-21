import { createContext } from 'react'
import type { LearnerProfile } from './profileStorage.ts'

export interface LearnerProfileContextValue {
  openProfileEditor: () => void
  profile: LearnerProfile | null
}

export const LearnerProfileContext =
  createContext<LearnerProfileContextValue | null>(null)
