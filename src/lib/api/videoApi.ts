import type { ZodType } from 'zod'
import { appConfig } from '../config/appConfig.ts'
import { createHttpClient } from './httpClient.ts'
import {
  commentListSchema,
  createdResourceSchema,
  singleVideoSchema,
  videoListSchema,
} from './schemas.ts'
import type {
  Comment,
  CreatedResource,
  CreateCommentInput,
  CreateVideoInput,
  EditVideoInput,
  Video,
} from './types.ts'

type Fetcher = typeof fetch

interface VideoApiOptions {
  baseUrl?: string
  fetcher?: Fetcher
}

function parse<T>(schema: ZodType<T>, data: unknown): T {
  return schema.parse(data)
}

export function createVideoApi({
  baseUrl = appConfig.apiBaseUrl,
  fetcher,
}: VideoApiOptions = {}) {
  const request = createHttpClient({
    baseUrl,
    ...(fetcher ? { fetcher } : {}),
  })

  return {
    async getVideos(userId: string, signal?: AbortSignal): Promise<Video[]> {
      const query = new URLSearchParams({ user_id: userId })
      const data = await request(`/videos?${query}`, { signal })
      return parse(videoListSchema, data)
    },

    async getVideo(videoId: string, signal?: AbortSignal): Promise<Video> {
      const query = new URLSearchParams({ video_id: videoId })
      const data = await request(`/videos/single?${query}`, { signal })
      return parse(singleVideoSchema, data)
    },

    async createVideo(input: CreateVideoInput): Promise<CreatedResource> {
      const data = await request('/videos', {
        method: 'POST',
        body: JSON.stringify({
          user_id: input.userId,
          title: input.title,
          description: input.description,
          video_url: input.videoUrl,
        }),
      })
      return parse(createdResourceSchema, data)
    },

    async editVideo(input: EditVideoInput): Promise<CreatedResource> {
      const data = await request('/videos', {
        method: 'PUT',
        body: JSON.stringify({
          video_id: input.videoId,
          title: input.title,
          description: input.description,
        }),
      })
      return parse(createdResourceSchema, data)
    },

    async getComments(
      videoId: string,
      signal?: AbortSignal,
    ): Promise<Comment[]> {
      const query = new URLSearchParams({ video_id: videoId })
      const data = await request(`/videos/comments?${query}`, { signal })
      return parse(commentListSchema, data)
    },

    async createComment(input: CreateCommentInput): Promise<CreatedResource> {
      const data = await request('/videos/comments', {
        method: 'POST',
        body: JSON.stringify({
          video_id: input.videoId,
          content: input.content,
          user_id: input.userId,
        }),
      })
      return parse(createdResourceSchema, data)
    },
  }
}

export const videoApi = createVideoApi()
