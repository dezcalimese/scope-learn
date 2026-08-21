import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { VideoForm } from './VideoForm.tsx'

const defaultProps = {
  isSubmitting: false,
  onCancel: vi.fn(),
  onSubmit: vi.fn().mockResolvedValue(undefined),
  userId: 'jane_doe',
}

describe('VideoForm', () => {
  it('shows field errors for an empty submission', async () => {
    const user = userEvent.setup()
    render(<VideoForm {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'Add video' }))

    expect(await screen.findByText(/title with at least 3/)).toBeVisible()
    expect(screen.getByText(/description with at least 10/)).toBeVisible()
    expect(screen.getByText('Enter a complete video URL.')).toBeVisible()
  })

  it('submits a valid lesson', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<VideoForm {...defaultProps} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Title'), 'A clear lesson')
    await user.type(
      screen.getByLabelText('Description'),
      'A useful and clear lesson description.',
    )
    await user.type(
      screen.getByLabelText('Video URL'),
      'https://example.com/lesson.mp4',
    )
    await user.click(screen.getByRole('button', { name: 'Add video' }))

    expect(onSubmit).toHaveBeenCalledWith(
      {
        title: 'A clear lesson',
        description: 'A useful and clear lesson description.',
        videoUrl: 'https://example.com/lesson.mp4',
      },
      expect.anything(),
    )
  })

  it('blocks submission when the candidate ID is missing', () => {
    render(<VideoForm {...defaultProps} userId={null} />)

    expect(screen.getByRole('button', { name: 'Add video' })).toBeDisabled()
    expect(screen.getByText(/VITE_USER_ID/)).toBeVisible()
  })
})
