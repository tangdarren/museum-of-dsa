import { Text } from '@react-three/drei'
import { useMemo } from 'react'
import { Quaternion, Vector3 } from 'three'
import type { GraphEdge as GraphEdgeData, GraphEdgeState } from '../../../types/graph'
import type { Vec3 } from '../../../navigation/destinations'
import { GRAPH_NODE_RADIUS } from './GraphNode'

const EDGE_COLORS: Record<GraphEdgeState, string> = {
  default: '#b0aaa0',
  active: '#5a5550',
  visited: '#8a857c',
  path: '#4a4844',
}

const UP = new Vector3(0, 1, 0)

type GraphEdgeProps = {
  edge: GraphEdgeData
  sourcePosition: Vec3
  targetPosition: Vec3
  state: GraphEdgeState
  showWeight: boolean
}

function GraphEdge({
  edge,
  sourcePosition,
  targetPosition,
  state,
  showWeight,
}: GraphEdgeProps) {
  const layout = useMemo(() => {
    const start = new Vector3(...sourcePosition)
    const end = new Vector3(...targetPosition)
    const direction = end.clone().sub(start)
    const length = Math.max(0.01, direction.length() - GRAPH_NODE_RADIUS * 2)
    const midpoint = start.clone().add(end).multiplyScalar(0.5)
    const quaternion = new Quaternion().setFromUnitVectors(
      UP,
      direction.normalize(),
    )

    return {
      length,
      position: midpoint.toArray() as Vec3,
      quaternion,
      weightPosition: [midpoint.x, midpoint.y + 0.055, midpoint.z] as Vec3,
    }
  }, [sourcePosition, targetPosition])

  return (
    <group>
      <mesh position={layout.position} quaternion={layout.quaternion}>
        <cylinderGeometry args={[0.011, 0.011, layout.length, 8]} />
        <meshStandardMaterial color={EDGE_COLORS[state]} />
      </mesh>
      {showWeight && edge.weight !== undefined ? (
        <Text
          position={layout.weightPosition}
          fontSize={0.045}
          color="#6a6560"
          anchorX="center"
          anchorY="middle"
        >
          {String(edge.weight)}
        </Text>
      ) : null}
    </group>
  )
}

export default GraphEdge
