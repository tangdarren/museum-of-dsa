import { Text, useCursor } from '@react-three/drei'
import { useState } from 'react'

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
      <mesh>
        <boxGeometry args={[3.6, height, 0.06]} />
        <meshStandardMaterial color={showHover ? '#5c5c58' : '#3c3c3a'} />
      </mesh>
      <Text
        position={[0, subtitle ? 0.1 : 0, 0.04]}
        fontSize={0.16}
        color="#f3f0ea"
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
          color="#c5c0b6"
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
