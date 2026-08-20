import { Text, useCursor } from '@react-three/drei'
import { useState } from 'react'
import { museum } from '../../theme/palette'
import type {
  AlgorithmCatalogEntry,
  AlgorithmCategory,
  AlgorithmId,
} from '../../types/algorithm'
import type { Vec3 } from '../../navigation/destinations'

type AlgorithmGalleryPanelProps = {
  category: AlgorithmCategory
  entries: AlgorithmCatalogEntry[]
  position: Vec3
  rotation: Vec3
  active?: boolean
  disabled?: boolean
  onSelectGallery?: (category: AlgorithmCategory) => void
  onSelectAlgorithm?: (id: AlgorithmId) => void
}

const PANEL_WIDTH = 2.42
const PANEL_HEIGHT = 3.02
const ROW_HEIGHT = 0.4

function prefersInteractive(
  disabled: boolean,
  handler?: (...args: never[]) => void,
) {
  return Boolean(handler) && !disabled
}

function AlgorithmGalleryPanel({
  category,
  entries,
  position,
  rotation,
  active = false,
  disabled = false,
  onSelectGallery,
  onSelectAlgorithm,
}: AlgorithmGalleryPanelProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const galleryInteractive = prefersInteractive(disabled, onSelectGallery)
  const listStartY = 0.62
  const hovered = hoveredRow === 'gallery' && galleryInteractive

  useCursor(Boolean(hoveredRow) && !disabled)

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.03]} receiveShadow>
        <boxGeometry args={[PANEL_WIDTH + 0.12, PANEL_HEIGHT + 0.12, 0.05]} />
        <meshStandardMaterial
          color={hovered || active ? museum.brass : museum.bronze}
          roughness={0.36}
          metalness={0.52}
        />
      </mesh>
      <mesh receiveShadow>
        <boxGeometry args={[PANEL_WIDTH, PANEL_HEIGHT, 0.06]} />
        <meshStandardMaterial
          color={hovered || active ? museum.slate : museum.charcoal}
          roughness={0.46}
          metalness={0.14}
        />
      </mesh>
      <group
        position={[0, PANEL_HEIGHT / 2 - 0.42, 0.04]}
        onPointerOver={
          galleryInteractive
            ? (event) => {
                event.stopPropagation()
                setHoveredRow('gallery')
              }
            : undefined
        }
        onPointerOut={
          galleryInteractive
            ? (event) => {
                event.stopPropagation()
                setHoveredRow((current) =>
                  current === 'gallery' ? null : current,
                )
              }
            : undefined
        }
        onClick={
          galleryInteractive
            ? (event) => {
                event.stopPropagation()
                onSelectGallery?.(category)
              }
            : undefined
        }
      >
        <mesh>
          <planeGeometry args={[PANEL_WIDTH - 0.28, 0.42]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <Text
          position={[0, 0.08, 0.01]}
          fontSize={0.13}
          color={museum.cream}
          anchorX="center"
          anchorY="middle"
          maxWidth={PANEL_WIDTH - 0.28}
          textAlign="center"
        >
          {category.toUpperCase()}
        </Text>
        <mesh position={[0, -0.16, 0.01]}>
          <boxGeometry args={[0.9, 0.012, 0.008]} />
          <meshStandardMaterial
            color={museum.brass}
            emissive={museum.brass}
            emissiveIntensity={active ? 0.22 : 0.12}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      </group>
      {entries.map((entry, index) => {
        const available = entry.available
        const rowInteractive = available && prefersInteractive(disabled, onSelectAlgorithm)
        const rowHovered = hoveredRow === entry.id && rowInteractive
        const y = listStartY - index * ROW_HEIGHT

        return (
          <group
            key={entry.id}
            position={[0, y, 0.045]}
            onPointerOver={
              rowInteractive
                ? (event) => {
                    event.stopPropagation()
                    setHoveredRow(entry.id)
                  }
                : undefined
            }
            onPointerOut={
              rowInteractive
                ? (event) => {
                    event.stopPropagation()
                    setHoveredRow((current) =>
                      current === entry.id ? null : current,
                    )
                  }
                : undefined
            }
            onClick={
              rowInteractive && entry.available
                ? (event) => {
                    event.stopPropagation()
                    onSelectAlgorithm?.(entry.id)
                  }
                : undefined
            }
          >
            <mesh>
              <planeGeometry args={[PANEL_WIDTH - 0.32, ROW_HEIGHT - 0.06]} />
              <meshBasicMaterial
                color={rowHovered ? museum.tealDeep : museum.charcoal}
                transparent
                opacity={rowHovered ? 0.85 : 0}
                depthWrite={false}
              />
            </mesh>
            <Text
              position={[0, available ? 0 : 0.05, 0.012]}
              fontSize={0.085}
              color={available ? museum.cream : museum.brassMuted}
              anchorX="center"
              anchorY="middle"
              maxWidth={PANEL_WIDTH - 0.4}
              textAlign="center"
            >
              {entry.title}
            </Text>
            {available ? null : (
              <Text
                position={[0, -0.1, 0.012]}
                fontSize={0.055}
                color={museum.brassMuted}
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.14}
              >
                COMING SOON
              </Text>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default AlgorithmGalleryPanel
