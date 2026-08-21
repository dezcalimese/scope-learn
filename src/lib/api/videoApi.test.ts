import { describe, expect, it, vi } from 'vitest'
import { createVideoApi } from './videoApi.ts'

describe('videoApi', () => {
  it('encodes a user ID in the list request', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ videos: [] })))
    const api = createVideoApi({ baseUrl: 'https://example.com/api', fetcher })

    await api.getVideos('jane_doe')

    expect(fetcher).toHaveBeenCalledWith(
      'https://example.com/api/videos?user_id=jane_doe',
      expect.any(Object),
    )
  })

  it('maps a video create input to the API field names', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ video_id: 'video-1' })))
    const api = createVideoApi({ baseUrl: 'https://example.com/api', fetcher })

    await api.createVideo({
      userId: 'jane_doe',
      title: 'A short lesson',
      description: 'A useful description.',
      videoUrl: 'https://example.com/lesson.mp4',
    })

    const request = fetcher.mock.calls[0]?.[1]
    expect(request?.method).toBe('POST')
    expect(JSON.parse(String(request?.body))).toEqual({
      user_id: 'jane_doe',
      title: 'A short lesson',
      description: 'A useful description.',
      video_url: 'https://example.com/lesson.mp4',
    })
  })
})
