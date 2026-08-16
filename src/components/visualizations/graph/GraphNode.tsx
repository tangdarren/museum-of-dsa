import { Text, useCursor } from '@react-three/drei'
import { useState } from 'react'
import type { GraphNode as GraphNodeData, GraphNodeState } from '../../../types/graph'

export const GRAPH_NODE_RADIUS = 0.075

const NODE_COLORS: Record<GraphNodeState, string> = {
  default: '#d8d3c8',
  active: '#6b6560',
  frontier: '#b2a898',
  visited: '#9a958c',
  start: '#6a7564',
  target: '#7a655c',
}

type GraphNodeProps = {
  node: GraphNodeData
  state: GraphNodeState
}

function GraphNode({ node, state }: GraphNodeProps) {
  const [hovered, setHovered] = useState(false)

  useCursor(hovered)

  return (
    <group position={node.position}>
      <mesh
        scale={[1, 0.82, 1]}
        castShadow
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={(event) => {
          event.stopPropagation()
          setHovered(false)
        }}
      >
        <sphereGeometry args={[GRAPH_NODE_RADIUS, 24, 16]} />
        <meshStandardMaterial
          color={NODE_COLORS[state]}
          emissive="#ffffff"
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>
      <Text
        position={[0, GRAPH_NODE_RADIUS + 0.07, 0]}
        fontSize={0.068}
        color="#3c3c3a"
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </group>
  )
}

export default GraphNode
