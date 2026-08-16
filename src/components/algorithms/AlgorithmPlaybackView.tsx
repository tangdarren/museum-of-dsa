import type { AlgorithmPlayback } from '../../hooks/useAlgorithmPlayback'
import AlgorithmPlaybackControls from './AlgorithmPlaybackControls'

type AlgorithmPlaybackViewProps = {
  playback: AlgorithmPlayback
  disabled?: boolean
  allowReset?: boolean
  onReset?: () => void
  selectionPrompt?: 'start' | 'target' | null
}

function AlgorithmPlaybackView({
  playback,
  disabled = false,
  allowReset = false,
  onReset,
  selectionPrompt = null,
}: AlgorithmPlaybackViewProps) {
  const auxiliary = playback.currentStep?.auxiliaryData
  const metrics = playback.currentStep?.metrics
  const inspection = playback.currentStep?.inspection
  const pathResult = playback.currentStep?.pathResult
  const traversalOrder = playback.currentStep?.snapshot?.traversalOrder
  const isPathComplete = playback.isComplete && Boolean(pathResult)
  const isTraversalComplete =
    playback.isComplete && Boolean(traversalOrder && traversalOrder.length > 0)
  const stepLabel = selectionPrompt === 'start'
    ? 'Select a start node'
    : selectionPrompt === 'target'
      ? 'Select a target node'
      : isPathComplete
        ? pathResult?.found
          ? 'Path found'
          : 'No path found'
        : isTraversalComplete
          ? 'Traversal complete'
          : playback.stepCount === 0
            ? 'No steps'
            : `Step ${playback.currentStepIndex + 1} of ${playback.stepCount}`
  const description = selectionPrompt === 'start'
    ? 'Select any node to begin.'
    : selectionPrompt === 'target'
      ? 'Select a destination node.'
      : (playback.currentStep?.description ?? 'Playback is unavailable.')

  return (
    <section className="algorithm-playback" aria-label="Algorithm playback">
      <p className="algorithm-playback-step">{stepLabel}</p>
      <p className="algorithm-playback-description" aria-live="polite">
        {description}
      </p>
      {isPathComplete && pathResult?.found ? (
        <div className="algorithm-playback-summary">
          <p className="algorithm-playback-order">{pathResult.nodes.join(' → ')}</p>
          {pathResult.cost !== null ? (
            <p className="algorithm-playback-cost">
              Total cost {pathResult.cost}
            </p>
          ) : null}
          {pathResult.exploredCount !== undefined ? (
            <p className="algorithm-playback-cost">
              Nodes explored {pathResult.exploredCount}
            </p>
          ) : null}
        </div>
      ) : null}
      {isTraversalComplete && traversalOrder ? (
        <p className="algorithm-playback-order">{traversalOrder.join(' → ')}</p>
      ) : null}
      {inspection ? (
        <div className="algorithm-playback-inspection">
          <p className="algorithm-playback-auxiliary-label">{inspection.title}</p>
          {inspection.lines.map((line) => (
            <p key={line} className="algorithm-playback-inspection-line">
              {line}
            </p>
          ))}
        </div>
      ) : null}
      {metrics && !isPathComplete ? (
        <div className="algorithm-playback-metrics">
          <p className="algorithm-playback-auxiliary-label">{metrics.label}</p>
          <table>
            <thead>
              <tr>
                {metrics.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.emphasized ? 'is-emphasis' : undefined}
                >
                  {row.cells.map((cell, index) => (
                    <td key={`${row.id}-${index}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <AlgorithmPlaybackControls
        playback={playback}
        disabled={disabled}
        allowReset={allowReset}
        onReset={onReset}
      />
    </section>
  )
}

export default AlgorithmPlaybackView
