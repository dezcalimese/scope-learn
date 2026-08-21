import { z } from 'zod'

export const PROFILE_STORAGE_KEY = 'scope-learn:profile:v1'

const storedProfileSchema = z.object({
  version: z.literal(1),
  displayName: z.string().trim().min(2).max(50),
  userId: z.string().min(1),
})

export type LearnerProfile = Omit<
  z.infer<typeof storedProfileSchema>,
  'version'
>

export function makeUserId(displayName: string) {
  const normalized = displayName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return normalized || 'learner'
}

export function readProfile(
  storage: Pick<Storage, 'getItem'>,
): LearnerProfile | null {
  try {
    const value = storage.getItem(PROFILE_STORAGE_KEY)

    if (!value) {
      return null
    }

    const parsed = storedProfileSchema.safeParse(JSON.parse(value) as unknown)
    return parsed.success
      ? { displayName: parsed.data.displayName, userId: parsed.data.userId }
      : null
  } catch {
    return null
  }
}

export function writeProfile(
  storage: Pick<Storage, 'setItem'>,
  displayName: string,
): LearnerProfile {
  const profile = {
    displayName: displayName.trim(),
    userId: makeUserId(displayName),
  }

  storage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify({ version: 1, ...profile }),
  )

  return profile
}
