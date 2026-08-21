import { z } from 'zod'

export const commentSchema = z
  .string()
  .trim()
  .min(2, 'Write at least 2 characters.')
  .max(500, 'Keep the comment under 500 characters.')
