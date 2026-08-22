import type { AlgorithmPlayback } from '../../hooks/useAlgorithmPlayback'
import type { AlgorithmId } from '../../types/algorithm'
import type { AlgorithmHashTableSnapshot } from '../../types/algorithmStep'
import type { SortingMetrics } from '../../types/sorting'
import AlgorithmPlaybackControls from './AlgorithmPlaybackControls'
import type { HashTableControlMode } from './HashTableControls'
import LinkedListControls, {
  type LinkedListControlMode,
  type LinkedListDeleteControls,
  type LinkedListInsertControls,
  type LinkedListSearchControls,
} from './LinkedListControls'
import SortingArrayControls from './SortingArrayControls'
import SortingMetricsDisplay from './SortingMetricsDisplay'
import TreeSearchControls from './TreeSearchControls'

export type SortingPlaybackExtras = {
  algorithmId: AlgorithmId
  metrics: SortingMetrics | null
  sortedValues?: number[]
  onRandomizeArray: () => void
  onResetArray: () => void
}

export type TreeSearchPlaybackExtras = {
  targetValue: number
  presentValues: number[]
  missingValues: number[]
  onSelectTarget: (value: number) => void
}

export type LinkedListPlaybackExtras = {
  mode: LinkedListControlMode
  disabled?: boolean
  search?: LinkedListSearchControls
  insert?: LinkedListInsertControls
  delete?: LinkedListDeleteControls
}

export type HashTablePlaybackExtras = {
  mode: HashTableControlMode
  snapshot: AlgorithmHashTableSnapshot | null
}

type AlgorithmPlaybackViewProps = {
  playback: AlgorithmPlayback
  disabled?: boolean
  allowReset?: boolean
  onReset?: () => void
  selectionPrompt?: 'start' | 'target' | null
  sorting?: SortingPlaybackExtras
  treeSearch?: TreeSearchPlaybackExtras
  linkedList?: LinkedListPlaybackExtras
  hashTable?: HashTablePlaybackExtras
}

function AlgorithmPlaybackView({
  playback,
  disabled = false,
  allowReset = false,
  onReset,
  selectionPrompt = null,
  sorting,
  treeSearch,
  linkedList,
  hashTable,
}: AlgorithmPlaybackViewProps) {
  const auxiliary = playback.currentStep?.auxiliaryData
  const metrics = playback.currentStep?.metrics
  const inspection = playback.currentStep?.inspection
  const pathResult = playback.currentStep?.pathResult
  const linkedListSnapshot = playback.currentStep?.linkedListSnapshot
  const traversalOrder =
    playback.currentStep?.snapshot?.traversalOrder ??
    playback.currentStep?.treeSnapshot?.traversalOrder
  const isPathComplete =
    playback.isComplete &&
    Boolean(pathResult) &&
    Boolean(playback.currentStep?.snapshot)
  const isTreeSearchComplete =
    playback.isComplete &&
    Boolean(pathResult) &&
    Boolean(playback.currentStep?.treeSnapshot)
  const isLinkedListSearchComplete =
    playback.isComplete && Boolean(pathResult) && Boolean(linkedListSnapshot)
  const hashTableSnapshot =
    hashTable?.snapshot ?? playback.currentStep?.hashTableSnapshot ?? null
  const isHashTableComplete =
    Boolean(hashTable) &&
    playback.isComplete &&
    Boolean(hashTableSnapshot)
  const hashTableStepLabel =
    hashTable && isHashTableComplete
      ? hashTable.mode === 'insert'
        ? pathResult?.found
          ? 'Key updated'
          : 'Key inserted'
        : hashTable.mode === 'delete'
          ? pathResult?.found
            ? 'Key deleted'
            : 'Key not found'
          : pathResult?.found
            ? 'Key found'
            : 'Key not found'
      : null
  const isTraversalComplete =
    playback.isComplete && Boolean(traversalOrder && traversalOrder.length > 0)
  const isSortingComplete =
    Boolean(sorting) && playback.isComplete && Boolean(sorting?.sortedValues)
  const stepLabel = hashTableStepLabel
    ? hashTableStepLabel
    : selectionPrompt === 'start'
      ? 'Select a start node'
      : selectionPrompt === 'target'
        ? 'Select a target node'
        : isPathComplete
          ? pathResult?.found
            ? 'Path found'
            : 'No path found'
          : isTreeSearchComplete || isLinkedListSearchComplete
            ? pathResult?.found
              ? 'Value found'
              : 'Value not found'
            : isTraversalComplete
              ? 'Traversal complete'
              : isSortingComplete
                ? 'Array sorted'
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
      {isTreeSearchComplete && pathResult ? (
        <div className="algorithm-playback-summary">
          {pathResult.nodes.length > 0 ? (
            <>
              <p className="algorithm-playback-auxiliary-label">Search path</p>
              <p className="algorithm-playback-order">
                {pathResult.nodes.join(' → ')}
              </p>
            </>
          ) : null}
          {pathResult.exploredCount !== undefined ? (
            <p className="algorithm-playback-cost">
              Nodes visited {pathResult.exploredCount}
            </p>
          ) : null}
        </div>
      ) : null}
      {isLinkedListSearchComplete && pathResult ? (
        <div className="algorithm-playback-summary">
          {pathResult.nodes.length > 0 ? (
            <>
              <p className="algorithm-playback-auxiliary-label">Search path</p>
              <p className="algorithm-playback-order">
                {pathResult.nodes.join(' → ')}
              </p>
            </>
          ) : null}
          {pathResult.exploredCount !== undefined ? (
            <p className="algorithm-playback-cost">
              Nodes visited {pathResult.exploredCount}
            </p>
          ) : null}
        </div>
      ) : null}
      {isTraversalComplete && traversalOrder ? (
        <div className="algorithm-playback-summary">
          <p className="algorithm-playback-auxiliary-label">Traversal order</p>
          <p className="algorithm-playback-order">
            {traversalOrder.join(' → ')}
          </p>
          <p className="algorithm-playback-cost">
            Nodes visited {traversalOrder.length}
          </p>
        </div>
      ) : null}
      {isSortingComplete && sorting?.sortedValues ? (
        <p className="algorithm-playback-order">
          {sorting.sortedValues.join(' → ')}
        </p>
      ) : null}
      {inspection && !hashTable ? (
        <div className="algorithm-playback-inspection">
          <p className="algorithm-playback-auxiliary-label">{inspection.title}</p>
          {inspection.lines.map((line) => (
            <p key={line} className="algorithm-playback-inspection-line">
              {line}
            </p>
          ))}
        </div>
      ) : null}
      {sorting?.metrics ? (
        <SortingMetricsDisplay
          algorithmId={sorting.algorithmId}
          metrics={sorting.metrics}
          isComplete={playback.isComplete}
        />
      ) : metrics &&
        !isPathComplete &&
        !isTreeSearchComplete &&
        !isLinkedListSearchComplete &&
        !isTraversalComplete ? (
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
      {sorting ? (
        <SortingArrayControls
          disabled={disabled}
          onRandomize={sorting.onRandomizeArray}
          onReset={sorting.onResetArray}
        />
      ) : null}
      {treeSearch ? (
        <TreeSearchControls
          disabled={disabled}
          targetValue={treeSearch.targetValue}
          presentValues={treeSearch.presentValues}
          missingValues={treeSearch.missingValues}
          onSelectTarget={treeSearch.onSelectTarget}
        />
      ) : null}
      {linkedList ? (
        <LinkedListControls
          disabled={linkedList.disabled ?? disabled}
          mode={linkedList.mode}
          search={linkedList.search}
          insert={linkedList.insert}
          delete={linkedList.delete}
        />
      ) : null}
    </section>
  )
}

export default AlgorithmPlaybackView
