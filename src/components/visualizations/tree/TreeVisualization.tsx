import { useMemo } from 'react'
import { mapTreeSnapshotToStates } from '../../algorithms/mapAlgorithmStepToTree'
import type { AlgorithmTreeSnapshot } from '../../../types/algorithmStep'
import { layoutBinaryTree } from './layoutBinaryTree'
import TreeEdge from './TreeEdge'
import TreeNode from './TreeNode'

type TreeVisualizationProps = {
  snapshot: AlgorithmTreeSnapshot | null
}

function TreeVisualization({ snapshot }: TreeVisualizationProps) {
  const layout = useMemo(
    () =>
      snapshot
        ? layoutBinaryTree(snapshot.rootNodeId, snapshot.nodes)
        : layoutBinaryTree(null, []),
    [snapshot],
  )
  const states = useMemo(
    () => mapTreeSnapshotToStates(snapshot),
    [snapshot],
  )

  if (!snapshot || snapshot.nodes.length === 0 || layout.positions.size === 0) {
    return <group />
  }

  return (
    <group>
      {snapshot.edges.map((edge) => {
        const source = layout.positions.get(edge.source)
        const target = layout.positions.get(edge.target)

        if (!source || !target) {
          return null
        }

        return (
          <TreeEdge
            key={edge.id}
            sourcePosition={source}
            targetPosition={target}
            state={states.edgeStates[edge.id] ?? 'default'}
            radius={layout.radius}
          />
        )
      })}
      {snapshot.nodes.map((node) => {
        const position = layout.positions.get(node.id)

        if (!position) {
          return null
        }

        return (
          <TreeNode
            key={node.id}
            node={node}
            state={states.nodeStates[node.id] ?? 'default'}
            position={position}
            radius={layout.radius}
            fontSize={layout.fontSize}
          />
        )
      })}
    </group>
  )
}

export default TreeVisualization
