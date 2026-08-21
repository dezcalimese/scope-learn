import { describe, expect, it, vi } from 'vitest'
import {
  makeUserId,
  PROFILE_STORAGE_KEY,
  readProfile,
  writeProfile,
} from './profileStorage.ts'

describe('profile storage', () => {
  it('creates a stable comment ID from a display name', () => {
    expect(makeUserId('  Álex Student  ')).toBe('alex_student')
  })

  it('writes only the versioned profile fields', () => {
    const setItem = vi.fn()

    expect(writeProfile({ setItem }, 'Alex Student')).toEqual({
      displayName: 'Alex Student',
      userId: 'alex_student',
    })
    expect(setItem).toHaveBeenCalledWith(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        displayName: 'Alex Student',
        userId: 'alex_student',
      }),
    )
  })

  it('returns null for malformed stored data', () => {
    expect(readProfile({ getItem: () => '{bad json' })).toBeNull()
    expect(
      readProfile({ getItem: () => JSON.stringify({ version: 9 }) }),
    ).toBeNull()
  })
})
