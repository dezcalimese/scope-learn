import { describe, expect, it } from 'vitest'
import { readAppConfig } from './appConfig.ts'

describe('readAppConfig', () => {
  it('uses the service URL and reports a missing user ID', () => {
    const config = readAppConfig({})

    expect(config.apiBaseUrl).toBe('/api')
    expect(config.userId).toBeNull()
    expect(config.issues).toContain('VITE_USER_ID is not set.')
  })

  it('accepts a snake-case candidate name and removes a trailing slash', () => {
    const config = readAppConfig({
      VITE_API_BASE_URL: 'https://example.com/api/',
      VITE_USER_ID: 'jane_doe',
    })

    expect(config).toEqual({
      apiBaseUrl: 'https://example.com/api',
      userId: 'jane_doe',
      issues: [],
    })
  })

  it('rejects a user ID that is not snake case', () => {
    const config = readAppConfig({ VITE_USER_ID: 'Jane Doe' })

    expect(config.userId).toBeNull()
    expect(config.issues[0]).toMatch(/snake-case/)
  })
})
