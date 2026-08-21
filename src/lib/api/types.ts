export interface Video {
  createdAt?: string
  description: string
  title: string
  userId: string
  videoId: string
  videoUrl: string
}

export interface Comment {
  commentId?: string
  content: string
  createdAt?: string
  userId: string
  videoId: string
}

export interface CreateVideoInput {
  description: string
  title: string
  userId: string
  videoUrl: string
}

export interface EditVideoInput {
  description: string
  title: string
  videoId: string
}

export interface CreateCommentInput {
  content: string
  userId: string
  videoId: string
}

export interface CreatedResource {
  id: string | null
}
