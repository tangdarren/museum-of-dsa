import { Text, useCursor } from '@react-three/drei'
import { useState } from 'react'
import { museum } from '../../theme/palette'

type MuseumSignProps = {
  position: [number, number, number]
  rotation?: [number, number, number]
  label: string
  subtitle?: string
  onSelect?: () => void
  disabled?: boolean
}

function MuseumSign({
  position,
  rotation = [0, 0, 0],
  label,
  subtitle,
  onSelect,
  disabled = false,
}: MuseumSignProps) {
  const [hovered, setHovered] = useState(false)
  const interactive = Boolean(onSelect) && !disabled
  const showHover = hovered && interactive
  const height = subtitle ? 0.68 : 0.42

  useCursor(showHover)

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={
        interactive
          ? (event) => {
              event.stopPropagation()
              setHovered(true)
            }
          : undefined
      }
      onPointerOut={
        interactive
          ? (event) => {
              event.stopPropagation()
              setHovered(false)
            }
          : undefined
      }
      onClick={
        interactive
          ? (event) => {
              event.stopPropagation()
              onSelect?.()
            }
          : undefined
      }
    >
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[3.72, height + 0.08, 0.04]} />
        <meshStandardMaterial
          color={showHover ? museum.brass : museum.bronze}
          roughness={0.36}
          metalness={0.52}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[3.6, height, 0.06]} />
        <meshStandardMaterial
          color={showHover ? museum.slate : museum.charcoal}
          roughness={0.46}
          metalness={0.14}
        />
      </mesh>
      <Text
        position={[0, subtitle ? 0.1 : 0, 0.04]}
        fontSize={0.16}
        color={museum.cream}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.14}
      >
        {label}
      </Text>
      {subtitle ? (
        <Text
          position={[0, -0.16, 0.04]}
          fontSize={0.11}
          color={museum.brassMuted}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.16}
        >
          {subtitle}
        </Text>
      ) : null}
    </group>
  )
}

export default MuseumSign
