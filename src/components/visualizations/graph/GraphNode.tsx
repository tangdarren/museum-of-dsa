import { Text, useCursor } from '@react-three/drei'
import { useState } from 'react'
import type { GraphNode as GraphNodeData, GraphNodeState } from '../../../types/graph'
import { graphNodeStyle, museum } from '../../../theme/palette'

export const GRAPH_NODE_RADIUS = 0.082

type GraphNodeProps = {
  node: GraphNodeData
  state: GraphNodeState
  selectable?: boolean
  onSelect?: (nodeId: string) => void
}

function GraphNode({ node, state, selectable = false, onSelect }: GraphNodeProps) {
  const [hovered, setHovered] = useState(false)
  const style = graphNodeStyle[state]
  const ring = 'ring' in style ? style.ring : null

  useCursor(hovered && selectable)

  return (
    <group position={node.position} scale={style.scale}>
      <mesh
        scale={[1, 0.86, 1]}
        castShadow
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={(event) => {
          event.stopPropagation()
          setHovered(false)
        }}
        onClick={
          selectable
            ? (event) => {
                event.stopPropagation()
                onSelect?.(node.id)
              }
            : undefined
        }
      >
        <sphereGeometry args={[GRAPH_NODE_RADIUS, 32, 22]} />
        <meshStandardMaterial
          color={style.color}
          emissive={style.emissive}
          emissiveIntensity={
            style.emissiveIntensity + (hovered ? (selectable ? 0.2 : 0.12) : 0)
          }
          roughness={style.roughness}
          metalness={style.metalness}
        />
      </mesh>
      {ring ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[GRAPH_NODE_RADIUS * 1.32, 0.007, 10, 28]} />
          <meshStandardMaterial
            color={ring}
            emissive={ring}
            emissiveIntensity={0.18}
            roughness={0.28}
            metalness={0.5}
          />
        </mesh>
      ) : null}
      <Text
        position={[0, GRAPH_NODE_RADIUS + 0.075, 0]}
        fontSize={0.07}
        color={museum.cream}
        outlineWidth={0.005}
        outlineColor={museum.slateDeep}
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </group>
  )
}

export default GraphNode
