import { describe, expect, it } from 'vitest'
import {
  commentListSchema,
  createdResourceSchema,
  singleVideoSchema,
  videoListSchema,
} from './schemas.ts'

const rawVideo = {
  video_id: 'video-1',
  user_id: 'jane_doe',
  title: 'Fractions in five minutes',
  description: 'A visual introduction to fractions.',
  video_url: 'https://example.com/fractions.mp4',
  created_at: '2026-08-21T12:00:00Z',
}

describe('API response schemas', () => {
  it('parses the confirmed video list envelope', () => {
    expect(videoListSchema.parse({ videos: [rawVideo] })).toEqual([
      {
        videoId: 'video-1',
        userId: 'jane_doe',
        title: 'Fractions in five minutes',
        description: 'A visual introduction to fractions.',
        videoUrl: 'https://example.com/fractions.mp4',
        createdAt: '2026-08-21T12:00:00Z',
      },
    ])
  })

  it('parses JSON that the API returns inside a string', () => {
    const response = JSON.stringify({ videos: [rawVideo] })

    expect(videoListSchema.parse(response)).toHaveLength(1)
  })

  it('accepts an id alias on a single video response', () => {
    const { video_id: _videoId, ...withoutVideoId } = rawVideo

    expect(
      singleVideoSchema.parse({ video: { ...withoutVideoId, id: 'video-2' } }),
    ).toMatchObject({ videoId: 'video-2' })
  })

  it('parses a comment envelope', () => {
    expect(
      commentListSchema.parse({
        comments: [
          {
            comment_id: 'comment-1',
            video_id: 'video-1',
            user_id: 'student_one',
            content: 'The diagram made this clear.',
          },
        ],
      }),
    ).toEqual([
      {
        commentId: 'comment-1',
        videoId: 'video-1',
        userId: 'student_one',
        content: 'The diagram made this clear.',
      },
    ])
  })

  it('normalizes common create responses', () => {
    expect(createdResourceSchema.parse('video-1')).toEqual({ id: 'video-1' })
    expect(createdResourceSchema.parse({ video_id: 'video-2' })).toEqual({
      id: 'video-2',
    })
    expect(createdResourceSchema.parse(null)).toEqual({ id: null })
    expect(createdResourceSchema.parse({ success: 'POST /videos' })).toEqual({
      id: null,
    })
  })

  it('rejects a video without an ID', () => {
    const { video_id: _videoId, ...withoutId } = rawVideo

    expect(() => singleVideoSchema.parse(withoutId)).toThrow(
      'Video data does not include an ID.',
    )
  })
})
