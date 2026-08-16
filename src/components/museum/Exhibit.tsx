import { Text, useCursor } from '@react-three/drei'
import { useState, type ReactNode } from 'react'
import type { Exhibit as ExhibitData } from '../../types/exhibit'
import type { ExhibitWingId, Vec3 } from '../../navigation/destinations'
import MuseumPedestal from './MuseumPedestal'

const WING_ROTATION: Record<ExhibitWingId, Vec3> = {
  'graph-theory': [0, 0, 0],
  'data-structures': [0, Math.PI / 2, 0],
  algorithms: [0, -Math.PI / 2, 0],
}

type ExhibitProps = {
  exhibit: ExhibitData
  onSelect: () => void
  disabled?: boolean
  visualization?: ReactNode
}

function Exhibit({
  exhibit,
  onSelect,
  disabled = false,
  visualization,
}: ExhibitProps) {
  const [hovered, setHovered] = useState(false)
  const interactive = !disabled
  const showHover = hovered && interactive

  useCursor(showHover)

  return (
    <group
      position={exhibit.position}
      rotation={WING_ROTATION[exhibit.wing]}
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
              onSelect()
            }
          : undefined
      }
    >
      <MuseumPedestal position={[0, 0, 0]} />

      <mesh position={[0, 0.94, 0]} receiveShadow>
        <boxGeometry
          args={visualization ? [1.72, 0.04, 1.45] : [0.92, 0.04, 0.92]}
        />
        <meshStandardMaterial color={showHover ? '#cfc9be' : '#b8b3a8'} />
      </mesh>
      {visualization ? (
        <group position={[0, 1.02, 0]}>{visualization}</group>
      ) : (
        <mesh position={[0, 1.42, 0]} castShadow>
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          <meshStandardMaterial
            color={showHover ? '#8f8a80' : '#7a756c'}
            transparent
            opacity={0.72}
          />
        </mesh>
      )}

      <mesh position={[0, 1.12, 0.62]}>
        <boxGeometry args={[1.55, 0.32, 0.04]} />
        <meshStandardMaterial color={showHover ? '#5c5c58' : '#3c3c3a'} />
      </mesh>
      <Text
        position={[0, 1.18, 0.65]}
        fontSize={0.09}
        color="#f3f0ea"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.45}
        textAlign="center"
      >
        {exhibit.title}
      </Text>
      <Text
        position={[0, 1.05, 0.65]}
        fontSize={0.055}
        color="#c5c0b6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        {exhibit.category}
      </Text>

      <Text
        position={[0, 2.16, 0]}
        fontSize={0.13}
        color="#3c3c3a"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
        textAlign="center"
      >
        {exhibit.title}
      </Text>
    </group>
  )
}

export default Exhibit
