import type { AlgorithmPlayback } from '../../hooks/useAlgorithmPlayback'
import AlgorithmPlaybackControls from './AlgorithmPlaybackControls'

type AlgorithmPlaybackViewProps = {
  playback: AlgorithmPlayback
  disabled?: boolean
}

function AlgorithmPlaybackView({
  playback,
  disabled = false,
}: AlgorithmPlaybackViewProps) {
  const stepLabel =
    playback.stepCount === 0
      ? 'No steps'
      : `Step ${playback.currentStepIndex + 1} of ${playback.stepCount}`

  return (
    <section className="algorithm-playback" aria-label="Algorithm playback">
      <p className="algorithm-playback-step">{stepLabel}</p>
      <p className="algorithm-playback-description">
        {playback.currentStep?.description ?? 'Playback is unavailable.'}
      </p>
      <AlgorithmPlaybackControls playback={playback} disabled={disabled} />
    </section>
  )
}

export default AlgorithmPlaybackView
