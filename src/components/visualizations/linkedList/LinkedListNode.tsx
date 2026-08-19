import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, type Group, type MeshStandardMaterial } from 'three'
import { linkedListNodeStyle, museum } from '../../../theme/palette'
import type {
  LinkedListNode as LinkedListNodeData,
  LinkedListNodeState,
} from '../../../types/linkedList'
import type { Vec3 } from '../../../navigation/destinations'

type LinkedListNodeProps = {
  node: LinkedListNodeData
  state: LinkedListNodeState
  position: Vec3
  width: number
  height: number
  depth: number
  fontSize: number
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function LinkedListNode({
  node,
  state,
  position,
  width,
  height,
  depth,
  fontSize,
}: LinkedListNodeProps) {
  const style = linkedListNodeStyle[state]
  const ring = 'ring' in style ? style.ring : null
  const groupRef = useRef<Group>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  const reduced = useRef(prefersReducedMotion())
  const targetColor = useMemo(() => new Color(style.color), [style.color])
  const targetEmissive = useMemo(() => new Color(style.emissive), [style.emissive])
  const display = useRef({
    x: position[0],
    y: position[1],
    z: position[2],
    scale: style.scale,
    color: new Color(style.color),
    emissive: new Color(style.emissive),
    emissiveIntensity: style.emissiveIntensity,
  })

  useFrame((_, delta) => {
    const t = reduced.current ? 1 : Math.min(1, delta * 8)
    const current = display.current
    current.x += (position[0] - current.x) * t
    current.y += (position[1] - current.y) * t
    current.z += (position[2] - current.z) * t
    current.scale += (style.scale - current.scale) * t
    current.color.lerp(targetColor, t)
    current.emissive.lerp(targetEmissive, t)
    current.emissiveIntensity +=
      (style.emissiveIntensity - current.emissiveIntensity) * t

    if (groupRef.current) {
      groupRef.current.position.set(current.x, current.y, current.z)
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
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
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[width * 0.62, 0.006, 10, 24]} />
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
        position={[0, 0, depth / 2 + 0.005]}
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

export default LinkedListNode
