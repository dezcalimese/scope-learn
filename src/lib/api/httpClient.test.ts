import { describe, expect, it, vi } from 'vitest'
import { createHttpClient } from './httpClient.ts'

describe('createHttpClient', () => {
  it('sets JSON headers for a write request', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ video_id: 'video-1' }), {
        status: 200,
      }),
    )
    const request = createHttpClient({
      baseUrl: 'https://example.com/api/',
      fetcher,
    })

    await request('/videos', { method: 'POST', body: '{}' })

    expect(fetcher).toHaveBeenCalledWith(
      'https://example.com/api/videos',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('throws a useful API error for a failed response', async () => {
    const request = createHttpClient({
      baseUrl: 'https://example.com/api',
      fetcher: vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ detail: 'Video not found' }), {
          status: 404,
        }),
      ),
    })

    await expect(request('/videos/single')).rejects.toEqual(
      expect.objectContaining({
        name: 'ApiError',
        message: 'Video not found',
        status: 404,
      }),
    )
  })

  it('wraps network failures', async () => {
    const request = createHttpClient({
      baseUrl: 'https://example.com/api',
      fetcher: vi
        .fn<typeof fetch>()
        .mockRejectedValue(new TypeError('offline')),
    })

    await expect(request('/videos')).rejects.toMatchObject({
      message: 'The API could not be reached.',
      status: 0,
    })
  })
})
