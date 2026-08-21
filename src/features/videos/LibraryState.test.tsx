import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  ConfigurationState,
  EmptyLibraryState,
  ErrorLibraryState,
} from './LibraryState.tsx'

describe('library states', () => {
  it('explains how to complete a missing candidate setup', () => {
    render(<ConfigurationState />)

    expect(screen.getByText('Complete the local setup')).toBeVisible()
    expect(screen.getByText(/VITE_USER_ID/)).toBeVisible()
  })

  it('shows a useful empty state', () => {
    render(<EmptyLibraryState />)

    expect(screen.getByText('Your library is ready')).toBeVisible()
  })

  it('lets the user retry a failed request', async () => {
    const user = userEvent.setup()
    const retry = vi.fn()
    render(<ErrorLibraryState retry={retry} />)

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(retry).toHaveBeenCalledOnce()
  })
})
