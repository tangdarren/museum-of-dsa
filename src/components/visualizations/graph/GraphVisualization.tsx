import { useMemo } from 'react'
import type {
  GraphData,
  GraphEdgeStates,
  GraphNodeStates,
} from '../../../types/graph'
import GraphEdge from './GraphEdge'
import GraphNode from './GraphNode'

type GraphVisualizationProps = {
  graph: GraphData
  nodeStates?: GraphNodeStates
  edgeStates?: GraphEdgeStates
  showWeights?: boolean
}

function GraphVisualization({
  graph,
  nodeStates = {},
  edgeStates = {},
  showWeights = false,
}: GraphVisualizationProps) {
  const nodesById = useMemo(
    () => Object.fromEntries(graph.nodes.map((node) => [node.id, node])),
    [graph.nodes],
  )

  return (
    <group>
      {graph.edges.map((edge) => {
        const source = nodesById[edge.source]
        const target = nodesById[edge.target]

        if (!source || !target) {
          return null
        }

        return (
          <GraphEdge
            key={edge.id}
            edge={edge}
            sourcePosition={source.position}
            targetPosition={target.position}
            state={edgeStates[edge.id] ?? 'default'}
            showWeight={showWeights}
          />
        )
      })}
      {graph.nodes.map((node) => (
        <GraphNode
          key={node.id}
          node={node}
          state={nodeStates[node.id] ?? 'default'}
        />
      ))}
    </group>
  )
}

export default GraphVisualization
