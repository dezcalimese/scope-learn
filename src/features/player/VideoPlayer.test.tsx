import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VideoPlayer } from './VideoPlayer.tsx'

describe('VideoPlayer', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  })

  it('provides the required playback controls', () => {
    render(
      <VideoPlayer
        title="Fractions lesson"
        url="https://example.com/fractions.mp4"
      />,
    )

    expect(screen.getByRole('button', { name: 'Play video' })).toBeVisible()
    expect(screen.getByLabelText('Video progress')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Mute video' })).toBeVisible()
    expect(screen.getByLabelText('Volume')).toBeVisible()
    expect(screen.getByLabelText('Playback speed')).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Enter full screen' }),
    ).toBeVisible()
  })

  it('changes the media playback rate', async () => {
    const user = userEvent.setup()
    render(
      <VideoPlayer
        title="Fractions lesson"
        url="https://example.com/fractions.mp4"
      />,
    )

    await user.selectOptions(screen.getByLabelText('Playback speed'), '1.5')

    expect(
      screen.getByLabelText<HTMLVideoElement>('Fractions lesson').playbackRate,
    ).toBe(1.5)
  })

  it('supports the mute keyboard command when the player has focus', () => {
    render(
      <VideoPlayer
        title="Fractions lesson"
        url="https://example.com/fractions.mp4"
      />,
    )

    const player = screen.getByRole('region', {
      name: 'Fractions lesson video player',
    })
    fireEvent.keyDown(player, { key: 'm' })

    expect(screen.getByRole('button', { name: 'Unmute video' })).toBeVisible()
  })
})
