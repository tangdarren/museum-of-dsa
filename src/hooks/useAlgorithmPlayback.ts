import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_PLAYBACK_SPEED,
  PLAYBACK_INTERVAL_MS,
  type PlaybackSpeed,
} from '../data/playbackTiming'
import type { AlgorithmStep } from '../types/algorithmStep'

export type AlgorithmPlayback = {
  currentStep: AlgorithmStep | null
  currentStepIndex: number
  stepCount: number
  isPlaying: boolean
  isComplete: boolean
  speed: PlaybackSpeed
  canPlay: boolean
  canPrevious: boolean
  canNext: boolean
  play: () => void
  pause: () => void
  togglePlay: () => void
  next: () => void
  previous: () => void
  reset: () => void
  setSpeed: (speed: PlaybackSpeed) => void
}

export function useAlgorithmPlayback(
  steps: AlgorithmStep[],
  resetKey: string | null,
): AlgorithmPlayback {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<PlaybackSpeed>(DEFAULT_PLAYBACK_SPEED)

  const stepCount = steps.length
  const lastIndex = Math.max(0, stepCount - 1)
  const hasSteps = stepCount > 0
  const isComplete = hasSteps && currentStepIndex >= lastIndex
  const canPlay = hasSteps && !isComplete
  const canPrevious = hasSteps && currentStepIndex > 0
  const canNext = hasSteps && currentStepIndex < lastIndex
  const currentStep = hasSteps ? (steps[currentStepIndex] ?? null) : null

  useEffect(() => {
    setCurrentStepIndex(0)
    setIsPlaying(false)
  }, [resetKey])

  useEffect(() => {
    if (!isPlaying || !hasSteps || isComplete) {
      return
    }

    const timer = window.setTimeout(() => {
      setCurrentStepIndex((index) => Math.min(index + 1, lastIndex))
    }, PLAYBACK_INTERVAL_MS[speed])

    return () => {
      window.clearTimeout(timer)
    }
  }, [hasSteps, isComplete, isPlaying, lastIndex, speed, currentStepIndex])

  useEffect(() => {
    if (isComplete && isPlaying) {
      setIsPlaying(false)
    }
  }, [isComplete, isPlaying])

  const play = useCallback(() => {
    if (!hasSteps || isComplete) {
      return
    }

    setIsPlaying(true)
  }, [hasSteps, isComplete])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }

    if (!hasSteps || isComplete) {
      return
    }

    setIsPlaying(true)
  }, [hasSteps, isComplete, isPlaying])

  const next = useCallback(() => {
    if (!canNext) {
      return
    }

    setCurrentStepIndex((index) => Math.min(index + 1, lastIndex))
  }, [canNext, lastIndex])

  const previous = useCallback(() => {
    if (!canPrevious) {
      return
    }

    setCurrentStepIndex((index) => Math.max(index - 1, 0))
  }, [canPrevious])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
  }, [])

  return useMemo(
    () => ({
      currentStep,
      currentStepIndex,
      stepCount,
      isPlaying,
      isComplete,
      speed,
      canPlay,
      canPrevious,
      canNext,
      play,
      pause,
      togglePlay,
      next,
      previous,
      reset,
      setSpeed,
    }),
    [
      canNext,
      canPlay,
      canPrevious,
      currentStep,
      currentStepIndex,
      isComplete,
      isPlaying,
      next,
      pause,
      play,
      previous,
      reset,
      speed,
      stepCount,
      togglePlay,
    ],
  )
}
