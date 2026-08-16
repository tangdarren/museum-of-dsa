import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, type Mesh, type MeshStandardMaterial } from 'three'
import { museum, sortingBarStyle } from '../../../theme/palette'
import type { SortingValueState } from '../../../types/sorting'

type SortBarProps = {
  value: number
  state: SortingValueState
  x: number
  width: number
  depth: number
  height: number
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function SortBar({ value, state, x, width, depth, height }: SortBarProps) {
  const style = sortingBarStyle[state]
  const ring = 'ring' in style ? style.ring : null
  const meshRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  const reduced = useRef(prefersReducedMotion())
  const targetColor = useMemo(() => new Color(style.color), [style.color])
  const targetEmissive = useMemo(() => new Color(style.emissive), [style.emissive])
  const display = useRef({
    height,
    scale: style.scale,
    color: new Color(style.color),
    emissive: new Color(style.emissive),
    emissiveIntensity: style.emissiveIntensity,
  })

  useFrame((_, delta) => {
    const t = reduced.current ? 1 : Math.min(1, delta * 7)
    const current = display.current
    current.height += (height - current.height) * t
    current.scale += (style.scale - current.scale) * t
    current.color.lerp(targetColor, t)
    current.emissive.lerp(targetEmissive, t)
    current.emissiveIntensity +=
      (style.emissiveIntensity - current.emissiveIntensity) * t

    if (meshRef.current) {
      meshRef.current.position.y = current.height / 2
      meshRef.current.scale.set(current.scale, current.height, current.scale)
    }

    if (ringRef.current) {
      ringRef.current.position.y = current.height + 0.018
    }

    if (materialRef.current) {
      materialRef.current.color.copy(current.color)
      materialRef.current.emissive.copy(current.emissive)
      materialRef.current.emissiveIntensity = current.emissiveIntensity
    }
  })

  return (
    <group position={[x, 0, 0]}>
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        scale={[style.scale, height, style.scale]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, 1, depth]} />
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
        <mesh ref={ringRef} position={[0, height + 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[width * 0.58, 0.007, 10, 24]} />
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
        position={[0, -0.04, depth * 0.52]}
        fontSize={0.042}
        color={museum.cream}
        outlineWidth={0.004}
        outlineColor={museum.slateDeep}
        anchorX="center"
        anchorY="middle"
      >
        {String(value)}
      </Text>
    </group>
  )
}

export default SortBar
