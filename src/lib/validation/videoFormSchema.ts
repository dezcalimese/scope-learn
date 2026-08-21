import { z } from 'zod'

export const videoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Enter a title with at least 3 characters.')
    .max(100, 'Keep the title under 100 characters.'),
  description: z
    .string()
    .trim()
    .min(10, 'Enter a description with at least 10 characters.')
    .max(600, 'Keep the description under 600 characters.'),
  videoUrl: z
    .url('Enter a complete video URL.')
    .refine(
      (url) => url.startsWith('https://') || url.startsWith('http://'),
      'Use an HTTP or HTTPS video URL.',
    ),
})

export type VideoFormValues = z.infer<typeof videoFormSchema>
