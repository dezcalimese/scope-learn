import { useMutation, useQueryClient } from '@tanstack/react-query'
import { videoApi } from '../../lib/api/videoApi.ts'
import type { VideoFormValues } from '../../lib/validation/videoFormSchema.ts'
import { videoKeys } from './videoQueries.ts'

export function useCreateVideo(userId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: VideoFormValues) => {
      if (!userId) {
        throw new Error('Set VITE_USER_ID before you create a video.')
      }

      return videoApi.createVideo({ ...values, userId })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: videoKeys.all })
    },
  })
}
