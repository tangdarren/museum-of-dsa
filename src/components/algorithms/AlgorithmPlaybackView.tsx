import type { AlgorithmPlayback } from '../../hooks/useAlgorithmPlayback'
import AlgorithmPlaybackControls from './AlgorithmPlaybackControls'

type AlgorithmPlaybackViewProps = {
  playback: AlgorithmPlayback
  disabled?: boolean
  awaitingStart?: boolean
}

function AlgorithmPlaybackView({
  playback,
  disabled = false,
  awaitingStart = false,
}: AlgorithmPlaybackViewProps) {
  const auxiliary = playback.currentStep?.auxiliaryData
  const traversalOrder = playback.currentStep?.snapshot?.traversalOrder
  const isTraversalComplete =
    playback.isComplete && Boolean(traversalOrder && traversalOrder.length > 0)
  const stepLabel = awaitingStart
    ? 'Select a start node'
    : isTraversalComplete
      ? 'Traversal complete'
      : playback.stepCount === 0
        ? 'No steps'
        : `Step ${playback.currentStepIndex + 1} of ${playback.stepCount}`
  const description = awaitingStart
    ? 'Select any node to begin.'
    : (playback.currentStep?.description ?? 'Playback is unavailable.')

  return (
    <section className="algorithm-playback" aria-label="Algorithm playback">
      <p className="algorithm-playback-step">{stepLabel}</p>
      <p className="algorithm-playback-description">{description}</p>
      {isTraversalComplete && traversalOrder ? (
        <p className="algorithm-playback-order">{traversalOrder.join(' → ')}</p>
      ) : null}
      {auxiliary ? (
        <div className="algorithm-playback-auxiliary">
          <p className="algorithm-playback-auxiliary-label">{auxiliary.label}</p>
          {auxiliary.values.length === 0 ? (
            <p className="algorithm-playback-auxiliary-empty">Empty</p>
          ) : (
            <p className="algorithm-playback-auxiliary-values">
              {auxiliary.values.map((value, index) => {
                const emphasized =
                  (auxiliary.emphasis === 'first' && index === 0) ||
                  (auxiliary.emphasis === 'last' &&
                    index === auxiliary.values.length - 1)

                return (
                  <span key={`${value}-${index}`}>
                    {index > 0 ? ' → ' : null}
                    <span className={emphasized ? 'is-emphasis' : undefined}>
                      {value}
                    </span>
                  </span>
                )
              })}
            </p>
          )}
        </div>
      ) : null}
      <AlgorithmPlaybackControls playback={playback} disabled={disabled} />
    </section>
  )
}

export default AlgorithmPlaybackView
