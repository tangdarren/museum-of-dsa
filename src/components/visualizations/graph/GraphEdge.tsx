import { Text } from '@react-three/drei'
import { useMemo } from 'react'
import { Quaternion, Vector3 } from 'three'
import type { GraphEdge as GraphEdgeData, GraphEdgeState } from '../../../types/graph'
import type { Vec3 } from '../../../navigation/destinations'
import { graphEdgeStyle, museum } from '../../../theme/palette'
import { GRAPH_NODE_RADIUS } from './GraphNode'

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
  const style = graphEdgeStyle[state]
  const layout = useMemo(() => {
    const start = new Vector3(...sourcePosition)
    const end = new Vector3(...targetPosition)
    const direction = end.clone().sub(start)
    const length = Math.max(0.01, direction.length() - GRAPH_NODE_RADIUS * 2.4)
    const midpoint = start.clone().add(end).multiplyScalar(0.5)
    const quaternion = new Quaternion().setFromUnitVectors(
      UP,
      direction.normalize(),
    )

    return {
      length,
      position: midpoint.toArray() as Vec3,
      quaternion,
      weightPosition: [midpoint.x, midpoint.y + 0.058, midpoint.z] as Vec3,
    }
  }, [sourcePosition, targetPosition])

  return (
    <group>
      <mesh position={layout.position} quaternion={layout.quaternion}>
        <cylinderGeometry args={[style.radius, style.radius, layout.length, 12]} />
        <meshStandardMaterial
          color={style.color}
          emissive={style.emissive}
          emissiveIntensity={style.emissiveIntensity}
          roughness={0.42}
          metalness={0.22}
        />
      </mesh>
      {showWeight && edge.weight !== undefined ? (
        <Text
          position={layout.weightPosition}
          fontSize={0.046}
          color={museum.cream}
          outlineWidth={0.004}
          outlineColor={museum.slateDeep}
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
