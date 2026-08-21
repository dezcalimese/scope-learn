import { z } from 'zod'
import type { Comment, CreatedResource, Video } from './types.ts'

function decodeJsonString(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  if (
    !trimmed.startsWith('{') &&
    !trimmed.startsWith('[') &&
    !trimmed.startsWith('"')
  ) {
    return value
  }

  try {
    return JSON.parse(trimmed) as unknown
  } catch {
    return value
  }
}

const rawVideoSchema = z
  .object({
    created_at: z.string().optional(),
    description: z.string().catch(''),
    id: z.string().min(1).optional(),
    title: z.string().min(1),
    user_id: z.string().catch(''),
    video_id: z.string().min(1).optional(),
    video_url: z.string().min(1),
  })
  .refine((video) => video.video_id !== undefined || video.id !== undefined, {
    message: 'Video data does not include an ID.',
  })
  .transform((video): Video => ({
    videoId: video.video_id ?? video.id ?? '',
    userId: video.user_id,
    title: video.title,
    description: video.description,
    videoUrl: video.video_url,
    ...(video.created_at ? { createdAt: video.created_at } : {}),
  }))

const rawCommentSchema = z
  .object({
    comment_id: z.string().min(1).optional(),
    content: z.string(),
    created_at: z.string().optional(),
    id: z.string().min(1).optional(),
    user_id: z.string(),
    video_id: z.string(),
  })
  .transform((comment): Comment => ({
    videoId: comment.video_id,
    userId: comment.user_id,
    content: comment.content,
    ...(comment.comment_id || comment.id
      ? { commentId: comment.comment_id ?? comment.id }
      : {}),
    ...(comment.created_at ? { createdAt: comment.created_at } : {}),
  }))

export const videoListSchema = z.preprocess(
  decodeJsonString,
  z
    .union([
      z.array(rawVideoSchema),
      z.object({ videos: z.array(rawVideoSchema) }),
    ])
    .transform((result) => (Array.isArray(result) ? result : result.videos)),
)

export const singleVideoSchema = z.preprocess(
  decodeJsonString,
  z
    .union([rawVideoSchema, z.object({ video: rawVideoSchema })])
    .transform((result) => ('video' in result ? result.video : result)),
)

export const commentListSchema = z.preprocess(
  decodeJsonString,
  z
    .union([
      z.array(rawCommentSchema),
      z.object({ comments: z.array(rawCommentSchema) }),
    ])
    .transform((result) => (Array.isArray(result) ? result : result.comments)),
)

export const createdResourceSchema = z
  .preprocess(
    decodeJsonString,
    z.union([
      z.string().min(1),
      z.object({ id: z.string().min(1) }),
      z.object({ video_id: z.string().min(1) }),
      z.object({ comment_id: z.string().min(1) }),
      z.object({ success: z.string().min(1) }),
      z.null(),
    ]),
  )
  .transform((result): CreatedResource => {
    if (typeof result === 'string') {
      return { id: result }
    }

    if (result === null) {
      return { id: null }
    }

    if ('video_id' in result) {
      return { id: result.video_id }
    }

    if ('comment_id' in result) {
      return { id: result.comment_id }
    }

    if ('success' in result) {
      return { id: null }
    }

    return { id: result.id }
  })
