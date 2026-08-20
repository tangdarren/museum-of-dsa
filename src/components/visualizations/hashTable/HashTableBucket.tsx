import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, type Group, type MeshStandardMaterial } from 'three'
import { hashTableBucketStyle, museum } from '../../../theme/palette'
import type { HashTableBucketState } from '../../../types/hashTable'
import type { Vec3 } from '../../../navigation/destinations'

type HashTableBucketProps = {
  index: number
  state: HashTableBucketState
  chained: boolean
  position: Vec3
  width: number
  height: number
  depth: number
  fontSize: number
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function HashTableBucket({
  index,
  state,
  chained,
  position,
  width,
  height,
  depth,
  fontSize,
}: HashTableBucketProps) {
  const style = hashTableBucketStyle[state]
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
      <mesh position={[0, height * 0.42, depth * 0.52]}>
        <boxGeometry args={[width * 0.86, 0.008, 0.006]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.4}
          metalness={0.46}
        />
      </mesh>
      <Text
        position={[0, 0.004, depth / 2 + 0.005]}
        fontSize={fontSize * 1.12}
        color={museum.cream}
        outlineWidth={fontSize * 0.08}
        outlineColor={museum.slateDeep}
        anchorX="center"
        anchorY="middle"
      >
        {String(index)}
      </Text>
      {chained ? (
        <mesh position={[width * 0.38, height * 0.38, depth / 2 + 0.004]}>
          <sphereGeometry args={[0.01, 10, 8]} />
          <meshStandardMaterial
            color={museum.gold}
            emissive={museum.gold}
            emissiveIntensity={0.28}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      ) : null}
    </group>
  )
}

export default HashTableBucket
