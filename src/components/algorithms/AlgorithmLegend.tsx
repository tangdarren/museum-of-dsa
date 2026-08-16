import { graphEdgeStyle, graphNodeStyle } from '../../theme/palette'
import type { AlgorithmId } from '../../types/algorithm'

const LEGEND_ITEMS = {
  start: { label: 'Start', color: graphNodeStyle.start.color },
  target: { label: 'Target', color: graphNodeStyle.target.color },
  active: { label: 'Current', color: graphNodeStyle.active.color },
  frontier: { label: 'Frontier', color: graphNodeStyle.frontier.color },
  visited: { label: 'Visited', color: graphNodeStyle.visited.color },
  path: { label: 'Path', color: graphEdgeStyle.path.color },
} as const

const LEGEND_BY_ALGORITHM: Record<
  AlgorithmId,
  Array<keyof typeof LEGEND_ITEMS>
> = {
  bfs: ['start', 'active', 'frontier', 'visited'],
  dfs: ['start', 'active', 'frontier', 'visited'],
  dijkstra: ['start', 'target', 'active', 'frontier', 'visited', 'path'],
  astar: ['start', 'target', 'active', 'frontier', 'visited', 'path'],
}

type AlgorithmLegendProps = {
  algorithmId: AlgorithmId
}

function AlgorithmLegend({ algorithmId }: AlgorithmLegendProps) {
  return (
    <ul className="algorithm-legend" aria-label="Graph state legend">
      {LEGEND_BY_ALGORITHM[algorithmId].map((key) => {
        const item = LEGEND_ITEMS[key]

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
