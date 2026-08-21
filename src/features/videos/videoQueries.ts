import { useQuery } from '@tanstack/react-query'
import { videoApi } from '../../lib/api/videoApi.ts'

export const videoKeys = {
  all: ['videos'] as const,
  detail: (videoId: string) => ['videos', 'detail', videoId] as const,
  list: (userId: string) => ['videos', 'list', userId] as const,
}

export function useVideos(userId: string | null) {
  return useQuery({
    queryKey: videoKeys.list(userId ?? 'not-configured'),
    queryFn: ({ signal }) => videoApi.getVideos(userId ?? '', signal),
    enabled: userId !== null,
  })
}

export function useVideo(videoId: string) {
  return useQuery({
    queryKey: videoKeys.detail(videoId),
    queryFn: ({ signal }) => videoApi.getVideo(videoId, signal),
    enabled: videoId.length > 0,
  })
}
