import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, type Group, type MeshStandardMaterial } from 'three'
import { graphNodeStyle, museum } from '../../../theme/palette'
import type { TreeNode as TreeNodeData, TreeNodeState } from '../../../types/tree'
import type { Vec3 } from '../../../navigation/destinations'

const TREE_NODE_STYLE = {
  default: graphNodeStyle.default,
  active: graphNodeStyle.active,
  visited: graphNodeStyle.visited,
  frontier: graphNodeStyle.frontier,
  target: graphNodeStyle.target,
  found: graphNodeStyle.start,
} as const

type TreeNodeProps = {
  node: TreeNodeData
  state: TreeNodeState
  position: Vec3
  radius: number
  fontSize: number
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function TreeNode({ node, state, position, radius, fontSize }: TreeNodeProps) {
  const style = TREE_NODE_STYLE[state]
  const ring = 'ring' in style ? style.ring : null
  const groupRef = useRef<Group>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  const reduced = useRef(prefersReducedMotion())
  const targetColor = useMemo(() => new Color(style.color), [style.color])
  const targetEmissive = useMemo(() => new Color(style.emissive), [style.emissive])
  const display = useRef({
    scale: style.scale,
    color: new Color(style.color),
    emissive: new Color(style.emissive),
    emissiveIntensity: style.emissiveIntensity,
  })

  useFrame((_, delta) => {
    const t = reduced.current ? 1 : Math.min(1, delta * 8)
    const current = display.current
    current.scale += (style.scale - current.scale) * t
    current.color.lerp(targetColor, t)
    current.emissive.lerp(targetEmissive, t)
    current.emissiveIntensity +=
      (style.emissiveIntensity - current.emissiveIntensity) * t

    if (groupRef.current) {
      groupRef.current.scale.setScalar(current.scale)
    }

    if (materialRef.current) {
      materialRef.current.color.copy(current.color)
      materialRef.current.emissive.copy(current.emissive)
      materialRef.current.emissiveIntensity = current.emissiveIntensity
    }
  })

  return (
    <group ref={groupRef} position={position} scale={style.scale}>
      <mesh castShadow>
        <sphereGeometry args={[radius, 28, 20]} />
        <meshStandardMaterial
          ref={materialRef}
          color={style.color}
          emissive={style.emissive}
          emissiveIntensity={style.emissiveIntensity}
          roughness={style.roughness}
          metalness={style.metalness}
        />
      </mesh>
      {ring ? (
        <mesh>
          <torusGeometry args={[radius * 1.28, radius * 0.08, 10, 28]} />
          <meshStandardMaterial
            color={ring}
            emissive={ring}
            emissiveIntensity={0.2}
            roughness={0.28}
            metalness={0.5}
          />
        </mesh>
      ) : null}
      <Text
        position={[0, 0, radius + 0.005]}
        fontSize={fontSize}
        color={museum.cream}
        outlineWidth={fontSize * 0.08}
        outlineColor={museum.slateDeep}
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </group>
  )
}

export default TreeNode
