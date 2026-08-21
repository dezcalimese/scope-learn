import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CommentForm } from './CommentForm.tsx'

const baseProps = {
  authorName: 'Alex Student',
  isSubmitting: false,
  onRequestProfile: vi.fn(),
  onSubmit: vi.fn().mockResolvedValue(undefined),
}

describe('CommentForm', () => {
  it('asks for a profile when the learner has no name', async () => {
    const user = userEvent.setup()
    const onRequestProfile = vi.fn()
    render(
      <CommentForm
        {...baseProps}
        authorName={null}
        onRequestProfile={onRequestProfile}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Set display name' }))
    expect(onRequestProfile).toHaveBeenCalledOnce()
  })

  it('validates and submits a comment', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<CommentForm {...baseProps} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Post comment' }))
    expect(await screen.findByText(/at least 2 characters/)).toBeVisible()

    await user.type(
      screen.getByLabelText('Add to the discussion'),
      'Very clear!',
    )
    await user.click(screen.getByRole('button', { name: 'Post comment' }))

    expect(onSubmit).toHaveBeenCalledWith('Very clear!')
  })
})
