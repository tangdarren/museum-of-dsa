import type { AlgorithmId } from '../../types/algorithm'
import type { SortingMetrics } from '../../types/sorting'

const METRIC_LABELS: Record<
  'bubble-sort' | 'insertion-sort' | 'quick-sort' | 'merge-sort',
  { comparisons: string; swaps: string; writes: string }
> = {
  'bubble-sort': {
    comparisons: 'Comparisons',
    swaps: 'Swaps',
    writes: 'Writes',
  },
  'insertion-sort': {
    comparisons: 'Comparisons',
    swaps: 'Swaps',
    writes: 'Shifts',
  },
  'quick-sort': {
    comparisons: 'Comparisons',
    swaps: 'Swaps',
    writes: 'Writes',
  },
  'merge-sort': {
    comparisons: 'Comparisons',
    swaps: 'Swaps',
    writes: 'Writes',
  },
}

const METRIC_NOTES: Partial<
  Record<'bubble-sort' | 'insertion-sort' | 'quick-sort' | 'merge-sort', string>
> = {
  'insertion-sort': 'Shifts count values being assigned into new positions.',
  'merge-sort': 'Writes count values being assigned into the merged range.',
}

type SortingMetricsDisplayProps = {
  algorithmId: AlgorithmId
  metrics: SortingMetrics
  isComplete: boolean
}

function SortingMetricsDisplay({
  algorithmId,
  metrics,
  isComplete,
}: SortingMetricsDisplayProps) {
  if (
    algorithmId !== 'bubble-sort' &&
    algorithmId !== 'insertion-sort' &&
    algorithmId !== 'quick-sort' &&
    algorithmId !== 'merge-sort'
  ) {
    return null
  }

  const labels = METRIC_LABELS[algorithmId]
  const note = METRIC_NOTES[algorithmId]

  return (
    <div className="sorting-metrics" aria-label="Sorting metrics">
      <p className="algorithm-playback-auxiliary-label">
        {isComplete ? 'Final totals' : 'Metrics'}
      </p>
      <dl className="sorting-metrics-grid">
        <div>
          <dt>{labels.comparisons}</dt>
          <dd>{metrics.comparisons}</dd>
        </div>
        <div>
          <dt>{labels.swaps}</dt>
          <dd>{metrics.swaps}</dd>
        </div>
        <div>
          <dt>{labels.writes}</dt>
          <dd>{metrics.writes}</dd>
        </div>
      </dl>
      {note ? <p className="sorting-metrics-note">{note}</p> : null}
    </div>
  )
}

export default SortingMetricsDisplay
