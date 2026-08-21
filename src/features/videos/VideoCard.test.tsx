import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { VideoCard } from './VideoCard.tsx'

const video = {
  videoId: 'video 1',
  userId: 'jane_doe',
  title: 'Fractions in five minutes',
  description: 'A visual introduction to fractions.',
  videoUrl: 'https://example.com/fractions.mp4',
}

describe('VideoCard', () => {
  it('links the lesson title to an encoded watch route', () => {
    render(
      <MemoryRouter>
        <VideoCard video={video} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', { name: 'Watch Fractions in five minutes' }),
    ).toHaveAttribute('href', '/watch/video%201')
    expect(screen.getByText(video.description)).toBeVisible()
  })
})
