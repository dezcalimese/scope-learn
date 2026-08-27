import Expand from 'lucide-react/dist/esm/icons/expand.mjs'
import Pause from 'lucide-react/dist/esm/icons/pause.mjs'
import Play from 'lucide-react/dist/esm/icons/play.mjs'
import Volume1 from 'lucide-react/dist/esm/icons/volume-1.mjs'
import Volume2 from 'lucide-react/dist/esm/icons/volume-2.mjs'
import VolumeX from 'lucide-react/dist/esm/icons/volume-x.mjs'
import { useEffect, useRef, useState } from 'react'

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  const time = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`

  return hours > 0 ? `${hours}:${time.padStart(5, '0')}` : time
}

export interface VideoPlayerProps {
  title: string
  url: string
}

export function VideoPlayer({ title, url }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const [mediaError, setMediaError] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  async function togglePlayback() {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (video.paused) {
      try {
        await video.play()
      } catch {
        setMediaError(true)
      }
    } else {
      video.pause()
    }
  }

  function seekTo(nextTime: number) {
    const video = videoRef.current

    if (!video) {
      return
    }

    const safeDuration = Number.isFinite(video.duration) ? video.duration : 0
    video.currentTime = Math.min(Math.max(nextTime, 0), safeDuration)
    setCurrentTime(video.currentTime)
  }

  function setPlayerVolume(nextVolume: number) {
    const video = videoRef.current

    if (!video) {
      return
    }

    const safeVolume = Math.min(Math.max(nextVolume, 0), 1)
    video.volume = safeVolume
    video.muted = safeVolume === 0
    setVolume(safeVolume)
    setIsMuted(video.muted)
  }

  function toggleMute() {
    const video = videoRef.current

    if (!video) {
      return
    }

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  function changePlaybackRate(nextRate: number) {
    const video = videoRef.current

    if (!video) {
      return
    }

    video.playbackRate = nextRate
    setPlaybackRate(nextRate)
  }

  async function toggleFullscreen() {
    const container = containerRef.current

    if (!container) {
      return
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await container.requestFullscreen()
      }
    } catch {
      setMediaError(true)
    }
  }

  function handleKeyboard(event: React.KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement

    if (target.matches('input, select, button')) {
      return
    }

    switch (event.key.toLowerCase()) {
      case ' ':
      case 'k':
        event.preventDefault()
        void togglePlayback()
        break
      case 'm':
        event.preventDefault()
        toggleMute()
        break
      case 'f':
        event.preventDefault()
        void toggleFullscreen()
        break
      case 'arrowleft':
        event.preventDefault()
        seekTo(currentTime - 5)
        break
      case 'arrowright':
        event.preventDefault()
        seekTo(currentTime + 5)
        break
      case 'arrowdown':
        event.preventDefault()
        setPlayerVolume(volume - 0.1)
        break
      case 'arrowup':
        event.preventDefault()
        setPlayerVolume(volume + 0.1)
        break
    }
  }

  const VolumeIcon =
    isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div
      aria-label={`${title} video player`}
      className={`group relative aspect-video overflow-hidden bg-black text-white outline-none ${isFullscreen ? '' : 'rounded-3xl shadow-2xl shadow-indigo-950/15'}`}
      onKeyDown={handleKeyboard}
      ref={containerRef}
      role="region"
      tabIndex={0}
    >
      <video
        aria-label={title}
        className="size-full bg-black object-contain"
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => setIsPaused(true)}
        onError={() => setMediaError(true)}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration)
          setMediaError(false)
        }}
        onPause={() => setIsPaused(true)}
        onPlay={() => setIsPaused(false)}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        playsInline
        preload="metadata"
        ref={videoRef}
        src={url}
      />

      {mediaError ? (
        <div className="absolute inset-0 grid place-items-center bg-black/90 p-8 text-center">
          <div className="max-w-md">
            <p className="text-lg font-semibold">
              This video cannot be played.
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Check that the URL points to a browser-playable MP4 or WebM file.
            </p>
          </div>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-4 pt-14 sm:px-5">
        <label className="sr-only" htmlFor="video-progress">
          Video progress
        </label>
        <input
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          className="player-range block w-full accent-indigo-400"
          id="video-progress"
          max={duration || 0}
          min="0"
          onChange={(event) => seekTo(Number(event.currentTarget.value))}
          step="0.1"
          type="range"
          value={Math.min(currentTime, duration || 0)}
        />

        <div className="mt-2 flex items-center gap-2 sm:gap-3">
          <button
            aria-label={isPaused ? 'Play video' : 'Pause video'}
            className="grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => void togglePlayback()}
            type="button"
          >
            {isPaused ? (
              <Play aria-hidden="true" fill="currentColor" size={18} />
            ) : (
              <Pause aria-hidden="true" fill="currentColor" size={18} />
            )}
          </button>

          <span className="hidden min-w-24 text-xs font-medium tabular-nums text-white/80 min-[400px]:inline">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <button
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="ml-auto grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={toggleMute}
            type="button"
          >
            <VolumeIcon aria-hidden="true" size={18} />
          </button>

          <div className="hidden items-center sm:flex">
            <label className="sr-only" htmlFor="video-volume">
              Volume
            </label>
            <input
              className="player-range w-20 accent-indigo-400"
              id="video-volume"
              max="1"
              min="0"
              onChange={(event) =>
                setPlayerVolume(Number(event.currentTarget.value))
              }
              step="0.05"
              type="range"
              value={isMuted ? 0 : volume}
            />
          </div>

          <label className="sr-only" htmlFor="playback-speed">
            Playback speed
          </label>
          <select
            aria-label="Playback speed"
            className="h-10 rounded-full border border-white/15 bg-black/35 px-2 text-xs font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-3"
            id="playback-speed"
            onChange={(event) =>
              changePlaybackRate(Number(event.currentTarget.value))
            }
            value={playbackRate}
          >
            {PLAYBACK_SPEEDS.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>

          <button
            aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
            className="grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => void toggleFullscreen()}
            type="button"
          >
            <Expand aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
