import { graphEdgeStyle, graphNodeStyle, sortingBarStyle } from '../../theme/palette'
import { isGraphAlgorithm, isSortingAlgorithm } from '../../algorithms/getAlgorithmSteps'
import type { AlgorithmId } from '../../types/algorithm'

const GRAPH_LEGEND_ITEMS = {
  start: { label: 'Start', color: graphNodeStyle.start.color },
  target: { label: 'Target', color: graphNodeStyle.target.color },
  active: { label: 'Current', color: graphNodeStyle.active.color },
  frontier: { label: 'Frontier', color: graphNodeStyle.frontier.color },
  visited: { label: 'Visited', color: graphNodeStyle.visited.color },
  path: { label: 'Path', color: graphEdgeStyle.path.color },
} as const

const SORTING_LEGEND_ITEMS = {
  active: { label: 'Active range', color: sortingBarStyle.active.color },
  compared: { label: 'Compared', color: sortingBarStyle.compared.color },
  written: { label: 'Moved', color: sortingBarStyle.written.color },
  pivot: { label: 'Pivot', color: sortingBarStyle.pivot.color },
  sorted: { label: 'Sorted', color: sortingBarStyle.sorted.color },
} as const

const GRAPH_LEGEND_BY_ALGORITHM: Record<
  'bfs' | 'dfs' | 'dijkstra' | 'astar',
  Array<keyof typeof GRAPH_LEGEND_ITEMS>
> = {
  bfs: ['start', 'active', 'frontier', 'visited'],
  dfs: ['start', 'active', 'frontier', 'visited'],
  dijkstra: ['start', 'target', 'active', 'frontier', 'visited', 'path'],
  astar: ['start', 'target', 'active', 'frontier', 'visited', 'path'],
}

const SORTING_LEGEND_BY_ALGORITHM: Record<
  'bubble-sort' | 'insertion-sort' | 'quick-sort' | 'merge-sort',
  Array<keyof typeof SORTING_LEGEND_ITEMS>
> = {
  'bubble-sort': ['active', 'compared', 'written', 'sorted'],
  'insertion-sort': ['active', 'compared', 'written', 'sorted'],
  'quick-sort': ['active', 'compared', 'written', 'pivot', 'sorted'],
  'merge-sort': ['active', 'compared', 'written', 'sorted'],
}

type AlgorithmLegendProps = {
  algorithmId: AlgorithmId
}

function AlgorithmLegend({ algorithmId }: AlgorithmLegendProps) {
  if (isSortingAlgorithm(algorithmId)) {
    return (
      <ul className="algorithm-legend" aria-label="Sorting state legend">
        {SORTING_LEGEND_BY_ALGORITHM[algorithmId].map((key) => {
          const item = SORTING_LEGEND_ITEMS[key]

          return (
            <li key={key}>
              <span
                className="algorithm-legend-swatch"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  if (!isGraphAlgorithm(algorithmId)) {
    return null
  }

  return (
    <ul className="algorithm-legend" aria-label="Graph state legend">
      {GRAPH_LEGEND_BY_ALGORITHM[algorithmId].map((key) => {
        const item = GRAPH_LEGEND_ITEMS[key]

        return (
          <li key={key}>
            <span
              className="algorithm-legend-swatch"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default AlgorithmLegend
