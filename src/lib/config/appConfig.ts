import { z } from 'zod'

const DEFAULT_API_BASE_URL =
  'https://take-home-assessment-423502.uc.r.appspot.com/api'

const userIdSchema = z
  .string()
  .trim()
  .regex(
    /^[a-z0-9]+(?:_[a-z0-9]+)+$/,
    'Use a snake-case first and last name, for example jane_doe.',
  )

const apiBaseUrlSchema = z.url().transform((url) => url.replace(/\/$/, ''))

export interface AppConfig {
  apiBaseUrl: string
  issues: string[]
  userId: string | null
}

export function readAppConfig(
  environment: Record<string, string | boolean | undefined>,
): AppConfig {
  const issues: string[] = []
  const baseUrlResult = apiBaseUrlSchema.safeParse(
    environment.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  )
  const rawUserId =
    typeof environment.VITE_USER_ID === 'string'
      ? environment.VITE_USER_ID
      : undefined
  const userIdResult = rawUserId ? userIdSchema.safeParse(rawUserId) : null

  if (!baseUrlResult.success) {
    issues.push('VITE_API_BASE_URL must be a valid URL.')
  }

  if (userIdResult !== null && !userIdResult.success) {
    issues.push(
      userIdResult.error.issues[0]?.message ?? 'VITE_USER_ID is invalid.',
    )
  }

  if (userIdResult === null) {
    issues.push('VITE_USER_ID is not set.')
  }

  return {
    apiBaseUrl: baseUrlResult.success
      ? baseUrlResult.data
      : DEFAULT_API_BASE_URL,
    userId: userIdResult?.success ? userIdResult.data : null,
    issues,
  }
}

export const appConfig = readAppConfig(import.meta.env)
