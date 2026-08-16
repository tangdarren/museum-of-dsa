export const PLAYBACK_SPEEDS = [0.5, 1, 2] as const

export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number]

export const DEFAULT_PLAYBACK_SPEED: PlaybackSpeed = 1

export const PLAYBACK_INTERVAL_MS: Record<PlaybackSpeed, number> = {
  0.5: 1800,
  1: 900,
  2: 450,
}
