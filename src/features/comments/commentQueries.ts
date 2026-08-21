import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { videoApi } from '../../lib/api/videoApi.ts'

export const commentKeys = {
  all: ['comments'] as const,
  list: (videoId: string) => ['comments', 'list', videoId] as const,
}

export function useComments(videoId: string) {
  return useQuery({
    queryKey: commentKeys.list(videoId),
    queryFn: ({ signal }) => videoApi.getComments(videoId, signal),
    enabled: videoId.length > 0,
  })
}

export function useCreateComment(videoId: string, userId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => {
      if (!userId) {
        throw new Error('Create a learner profile before you comment.')
      }

      return videoApi.createComment({ videoId, userId, content })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: commentKeys.list(videoId),
      })
    },
  })
}
