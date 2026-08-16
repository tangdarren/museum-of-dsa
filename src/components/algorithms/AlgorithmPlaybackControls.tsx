import { PLAYBACK_SPEEDS, type PlaybackSpeed } from '../../data/playbackTiming'
import type { AlgorithmPlayback } from '../../hooks/useAlgorithmPlayback'

type AlgorithmPlaybackControlsProps = {
  playback: AlgorithmPlayback
  disabled?: boolean
}

function AlgorithmPlaybackControls({
  playback,
  disabled = false,
}: AlgorithmPlaybackControlsProps) {
  const inactive = disabled || playback.stepCount === 0

  return (
    <div className="algorithm-playback-controls">
      <button
        type="button"
        className="algorithm-playback-button"
        onClick={playback.reset}
        disabled={inactive}
      >
        Reset
      </button>
      <button
        type="button"
        className="algorithm-playback-button"
        onClick={playback.previous}
        disabled={inactive || !playback.canPrevious}
      >
        Previous
      </button>
      <button
        type="button"
        className="algorithm-playback-button is-primary"
        onClick={playback.togglePlay}
        disabled={inactive || (!playback.isPlaying && !playback.canPlay)}
      >
        {playback.isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        type="button"
        className="algorithm-playback-button"
        onClick={playback.next}
        disabled={inactive || !playback.canNext}
      >
        Next
      </button>
      <div className="algorithm-playback-speeds" role="group" aria-label="Playback speed">
        {PLAYBACK_SPEEDS.map((speed: PlaybackSpeed) => (
          <button
            key={speed}
            type="button"
            className={
              playback.speed === speed
                ? 'algorithm-playback-button is-speed is-active'
                : 'algorithm-playback-button is-speed'
            }
            onClick={() => playback.setSpeed(speed)}
            disabled={inactive}
            aria-pressed={playback.speed === speed}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  )
}

export default AlgorithmPlaybackControls
