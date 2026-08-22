import { Text, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  SpotLight,
} from 'three'
import AlgorithmInstallation from '../components/museum/AlgorithmInstallation'
import ExhibitHall from '../components/museum/ExhibitHall'
import MuseumSign from '../components/museum/MuseumSign'
import { createIdleHashTableSnapshot, SAMPLE_HASH_TABLE } from '../data/sampleHashTable'
import { createSampleLinkedListSnapshot, SAMPLE_DOUBLY_LINKED_LIST, SAMPLE_LINKED_LIST } from '../data/sampleLinkedList'
import { museum } from '../theme/palette'
import type { AlgorithmDefinition } from '../types/algorithm'
import { isAlgorithmRoomCategory, isDataStructureCategory, isHashTableCategory } from '../types/algorithm'
import type { AlgorithmStep } from '../types/algorithmStep'
import type { GraphNodeStates } from '../types/graph'
import {
  ALGORITHMS_CENTER_X,
  DATA_STRUCTURE_INSTALLATION_POSITION,
  DATA_STRUCTURES_CENTER_X,
  ENTRANCE_PORTAL,
  FRONT_BACK,
  LOBBY_BACK,
  LOBBY_CENTER_Z,
  LOBBY_DEPTH,
  LOBBY_DOOR,
  LOBBY_DOOR_OFFSET,
  ROOM_DEPTH,
  ROOM_HEIGHT,
  ROOM_WIDTH,
  WALL_THICKNESS,
  type MuseumLocation,
} from '../navigation/destinations'

const IDLE_SINGLY_LINKED_LIST_SNAPSHOT =
  createSampleLinkedListSnapshot(SAMPLE_LINKED_LIST)
const IDLE_DOUBLY_LINKED_LIST_SNAPSHOT = createSampleLinkedListSnapshot(
  SAMPLE_DOUBLY_LINKED_LIST,
)
const IDLE_HASH_TABLE_SNAPSHOT = createIdleHashTableSnapshot(SAMPLE_HASH_TABLE)

const COLUMNS: [number, number, number][] = [
  [-7.2, ROOM_HEIGHT / 2, -8.5],
  [7.2, ROOM_HEIGHT / 2, -8.5],
  [-7.2, ROOM_HEIGHT / 2, 3.5],
  [7.2, ROOM_HEIGHT / 2, 3.5],
]

const FRONT_LIGHTS: [number, number, number][] = [
  [-8, ROOM_HEIGHT - 0.12, -7],
  [0, ROOM_HEIGHT - 0.12, -7],
  [8, ROOM_HEIGHT - 0.12, -7],
  [-8, ROOM_HEIGHT - 0.12, 3],
  [0, ROOM_HEIGHT - 0.12, 3],
  [8, ROOM_HEIGHT - 0.12, 3],
]

const LOBBY_LIGHTS: [number, number, number][] = [
  [-6, ROOM_HEIGHT - 0.12, LOBBY_CENTER_Z],
  [0, ROOM_HEIGHT - 0.12, LOBBY_CENTER_Z],
  [6, ROOM_HEIGHT - 0.12, LOBBY_CENTER_Z],
]

function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -ROOM_HEIGHT / 2 + 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.24, 0.72]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.5}
        />
      </mesh>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.58, ROOM_HEIGHT, 0.58]} />
        <meshStandardMaterial
          color={museum.column}
          roughness={0.78}
          metalness={0.04}
        />
      </mesh>
      <mesh position={[0, ROOM_HEIGHT / 2 - 0.1, 0]} castShadow>
        <boxGeometry args={[0.68, 0.16, 0.68]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.5}
        />
      </mesh>
    </group>
  )
}

function CeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.16, 0.04, 1.16]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.4}
          metalness={0.48}
        />
      </mesh>
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[1.1, 0.08, 1.1]} />
        <meshStandardMaterial
          color={museum.fixture}
          emissive={museum.lightWarm}
          emissiveIntensity={0.35}
          roughness={0.45}
        />
      </mesh>
      <pointLight
        intensity={4.2}
        distance={11}
        decay={2}
        color={museum.lightWarm}
      />
    </group>
  )
}

function Portal({
  position,
  rotation = [0, 0, 0],
  width,
  height,
  open = false,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  width: number
  height: number
  open?: boolean
}) {
  const frame = 0.16

  return (
    <group position={position} rotation={rotation}>
      {open ? (
        <>
          <mesh position={[-width / 2 - 0.04, 0, -0.16]}>
            <boxGeometry args={[0.1, height, 0.38]} />
            <meshStandardMaterial
              color={museum.charcoal}
              roughness={0.5}
              metalness={0.12}
            />
          </mesh>
          <mesh position={[width / 2 + 0.04, 0, -0.16]}>
            <boxGeometry args={[0.1, height, 0.38]} />
            <meshStandardMaterial
              color={museum.charcoal}
              roughness={0.5}
              metalness={0.12}
            />
          </mesh>
          <mesh position={[0, height / 2 + 0.04, -0.16]}>
            <boxGeometry args={[width + 0.18, 0.1, 0.38]} />
            <meshStandardMaterial
              color={museum.charcoal}
              roughness={0.5}
              metalness={0.12}
            />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[width, height, 0.22]} />
          <meshStandardMaterial
            color={museum.charcoal}
            roughness={0.5}
            metalness={0.12}
          />
        </mesh>
      )}
      <mesh position={[0, height / 2 + frame / 2, 0.02]}>
        <boxGeometry args={[width + frame * 2, frame, 0.14]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.36}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[0, -height / 2 - frame / 2, 0.02]}>
        <boxGeometry args={[width + frame * 2, frame, 0.14]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.36}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[-width / 2 - frame / 2, 0, 0.02]}>
        <boxGeometry args={[frame, height, 0.14]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.36}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[width / 2 + frame / 2, 0, 0.02]}>
        <boxGeometry args={[frame, height, 0.14]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.36}
          metalness={0.52}
        />
      </mesh>
    </group>
  )
}

function OpeningWall({
  z,
  width,
  height,
  thickness,
  openings,
}: {
  z: number
  width: number
  height: number
  thickness: number
  openings: { x: number; width: number; height: number; y: number }[]
}) {
  const sorted = [...openings].sort((a, b) => a.x - b.x)
  const segments: { x: number; w: number }[] = []
  let cursor = -width / 2

  for (const opening of sorted) {
    const left = opening.x - opening.width / 2
    const w = left - cursor

    if (w > 0.001) {
      segments.push({ x: cursor + w / 2, w })
    }

    cursor = opening.x + opening.width / 2
  }

  const remaining = width / 2 - cursor

  if (remaining > 0.001) {
    segments.push({ x: cursor + remaining / 2, w: remaining })
  }

  return (
    <group>
      {segments.map((segment) => (
        <mesh
          key={`wall-${segment.x}`}
          position={[segment.x, height / 2, z]}
          receiveShadow
        >
          <boxGeometry args={[segment.w, height, thickness]} />
          <meshStandardMaterial
            color={museum.wall}
            roughness={0.82}
            metalness={0.02}
          />
        </mesh>
      ))}
      {sorted.map((opening) => {
        const top = opening.y + opening.height / 2
        const bottom = opening.y - opening.height / 2
        const lintelHeight = height - top
        const sillHeight = Math.max(0, bottom)

        return (
          <group key={`opening-${opening.x}`}>
            {lintelHeight > 0.001 ? (
              <mesh
                position={[opening.x, top + lintelHeight / 2, z]}
                receiveShadow
              >
                <boxGeometry args={[opening.width, lintelHeight, thickness]} />
                <meshStandardMaterial
                  color={museum.wall}
                  roughness={0.82}
                  metalness={0.02}
                />
              </mesh>
            ) : null}
            {sillHeight > 0.001 ? (
              <mesh position={[opening.x, sillHeight / 2, z]} receiveShadow>
                <boxGeometry args={[opening.width, sillHeight, thickness]} />
                <meshStandardMaterial
                  color={museum.wall}
                  roughness={0.82}
                  metalness={0.02}
                />
              </mesh>
            ) : null}
          </group>
        )
      })}
    </group>
  )
}

function DestinationDoor({
  position,
  label,
  subtitle,
  open,
  onSelect,
  disabled = false,
}: {
  position: [number, number, number]
  label: string
  subtitle: string
  open: boolean
  onSelect?: () => void
  disabled?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const interactive = Boolean(onSelect) && !disabled

  useCursor(hovered && interactive)

  return (
    <group
      position={position}
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
      <Portal
        position={[0, LOBBY_DOOR.y, 0]}
        width={LOBBY_DOOR.width}
        height={LOBBY_DOOR.height}
        open={open}
      />
      <MuseumSign
        position={[0, 5.15, 0.04]}
        label={label}
        subtitle={subtitle}
      />
    </group>
  )
}

type MuseumSceneProps = {
  location: MuseumLocation
  selectedAlgorithm: AlgorithmDefinition | null
  previewAlgorithm: AlgorithmDefinition | null
  playbackStep: AlgorithmStep | null
  selectionPrompt?: 'start' | 'target' | null
  setupNodeStates?: GraphNodeStates
  onSelectNode?: (nodeId: string) => void
  onSelectAlgorithms: () => void
  onSelectDataStructures?: () => void
  isTransitioning: boolean
  showEntranceLettering?: boolean
}

function MuseumScene({
  location,
  selectedAlgorithm,
  previewAlgorithm,
  playbackStep,
  selectionPrompt = null,
  setupNodeStates,
  onSelectNode,
  onSelectAlgorithms,
  onSelectDataStructures,
  isTransitioning,
  showEntranceLettering = true,
}: MuseumSceneProps) {
  const showLobbyDestinations = location !== 'entrance'
  const algorithmsAlgorithm =
    selectedAlgorithm && isAlgorithmRoomCategory(selectedAlgorithm.category)
      ? selectedAlgorithm
      : null
  const algorithmsPreview =
    previewAlgorithm && isAlgorithmRoomCategory(previewAlgorithm.category)
      ? previewAlgorithm
      : null
  const dataStructureAlgorithm =
    selectedAlgorithm && isDataStructureCategory(selectedAlgorithm.category)
      ? selectedAlgorithm
      : null
  const dataStructurePreview =
    previewAlgorithm && isDataStructureCategory(previewAlgorithm.category)
      ? previewAlgorithm
      : null
  const dataStructureCategory =
    dataStructureAlgorithm?.category ?? dataStructurePreview?.category ?? null
  const showingHashTableExhibit =
    dataStructureCategory !== null && isHashTableCategory(dataStructureCategory)
  const showingDoublyLinkedListExhibit =
    dataStructureCategory === 'Doubly Linked List'
  const inspection = selectedAlgorithm !== null
  const ambientRef = useRef<AmbientLight>(null)
  const hemisphereRef = useRef<HemisphereLight>(null)
  const directionalRef = useRef<DirectionalLight>(null)
  const algorithmsFillRef = useRef<SpotLight>(null)
  const dataStructuresFillRef = useRef<SpotLight>(null)
  const lightBlend = useRef(0)
  const reducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useFrame((_, delta) => {
    const goal = inspection ? 1 : 0
    lightBlend.current = reducedMotion.current
      ? goal
      : lightBlend.current +
        (goal - lightBlend.current) * Math.min(1, delta * 1.7)
    const t = lightBlend.current

    if (ambientRef.current) {
      ambientRef.current.intensity = 0.3 - t * 0.08
    }

    if (hemisphereRef.current) {
      hemisphereRef.current.intensity = 0.42 - t * 0.1
    }

    if (directionalRef.current) {
      directionalRef.current.intensity = 0.72 - t * 0.2
    }

    if (algorithmsFillRef.current) {
      algorithmsFillRef.current.intensity = 10 - t * 4.5
    }

    if (dataStructuresFillRef.current) {
      dataStructuresFillRef.current.intensity = 10 - t * 4.5
    }
  })

  return (
    <>
      <color attach="background" args={[museum.atmosphere]} />

      <hemisphereLight
        ref={hemisphereRef}
        args={[museum.lightSky, museum.lightGround]}
        intensity={0.42}
      />
      <ambientLight ref={ambientRef} intensity={0.3} />
      <directionalLight
        ref={directionalRef}
        position={[5, 14, 7]}
        intensity={0.72}
        color={museum.lightWarm}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-40}
      />
      <spotLight
        position={[0, 8.2, -6]}
        angle={0.42}
        penumbra={0.7}
        intensity={18}
        distance={18}
        color={museum.lightWarm}
      />
      <spotLight
        position={[0, 8.2, LOBBY_CENTER_Z]}
        angle={0.5}
        penumbra={0.7}
        intensity={12}
        distance={16}
        color={museum.lightWarm}
      />

      <mesh position={[0, -WALL_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_WIDTH, WALL_THICKNESS, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={museum.stone}
          roughness={0.9}
          metalness={0.03}
        />
      </mesh>
      <mesh position={[0, 0.02, -1.5]} receiveShadow>
        <boxGeometry args={[10, 0.04, 12]} />
        <meshStandardMaterial
          color={museum.stoneDeep}
          roughness={0.88}
          metalness={0.04}
        />
      </mesh>

      <OpeningWall
        z={FRONT_BACK - WALL_THICKNESS / 2}
        width={ROOM_WIDTH + WALL_THICKNESS * 2}
        height={ROOM_HEIGHT}
        thickness={WALL_THICKNESS}
        openings={[{ x: 0, ...ENTRANCE_PORTAL }]}
      />
      <mesh
        position={[-ROOM_WIDTH / 2 - WALL_THICKNESS / 2, ROOM_HEIGHT / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>
      <mesh
        position={[ROOM_WIDTH / 2 + WALL_THICKNESS / 2, ROOM_HEIGHT / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>
      <mesh
        position={[-11, ROOM_HEIGHT / 2, ROOM_DEPTH / 2 + WALL_THICKNESS / 2]}
        receiveShadow
      >
        <boxGeometry args={[10, ROOM_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>
      <mesh
        position={[11, ROOM_HEIGHT / 2, ROOM_DEPTH / 2 + WALL_THICKNESS / 2]}
        receiveShadow
      >
        <boxGeometry args={[10, ROOM_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>
      <mesh
        position={[0, ROOM_HEIGHT - 0.7, ROOM_DEPTH / 2 + WALL_THICKNESS / 2]}
        receiveShadow
      >
        <boxGeometry args={[12, 1.4, WALL_THICKNESS]} />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>

      <mesh position={[0, ROOM_HEIGHT + WALL_THICKNESS / 2, 0]}>
        <boxGeometry args={[ROOM_WIDTH + WALL_THICKNESS * 2, WALL_THICKNESS, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={museum.ceiling}
          roughness={0.86}
          metalness={0.02}
        />
      </mesh>
      <mesh position={[0, ROOM_HEIGHT - 0.18, -1]}>
        <boxGeometry args={[18, 0.08, 16]} />
        <meshStandardMaterial
          color={museum.ceilingSoft}
          roughness={0.8}
          metalness={0.03}
        />
      </mesh>

      <mesh position={[0, 6.05, FRONT_BACK + 0.08]} receiveShadow>
        <boxGeometry args={[13.7, 2.66, 0.08]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0, 6.05, FRONT_BACK + 0.12]} receiveShadow>
        <boxGeometry args={[13.5, 2.5, 0.12]} />
        <meshStandardMaterial
          color={museum.charcoal}
          roughness={0.48}
          metalness={0.14}
        />
      </mesh>
      <Text
        position={[0, 6.28, FRONT_BACK + 0.2]}
        fontSize={0.74}
        color={museum.cream}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        visible={showEntranceLettering}
      >
        MUSEUM OF DSA
      </Text>
      <Text
        position={[0, 5.48, FRONT_BACK + 0.2]}
        fontSize={0.26}
        color={museum.brassMuted}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.14}
        visible={showEntranceLettering}
      >
        Data Structures & Algorithms
      </Text>

      <Portal
        position={[0, ENTRANCE_PORTAL.y, FRONT_BACK + 0.16]}
        width={ENTRANCE_PORTAL.width}
        height={ENTRANCE_PORTAL.height}
        open
      />

      <mesh position={[0, -WALL_THICKNESS / 2, LOBBY_CENTER_Z]} receiveShadow>
        <boxGeometry args={[ROOM_WIDTH, WALL_THICKNESS, LOBBY_DEPTH]} />
        <meshStandardMaterial
          color={museum.stone}
          roughness={0.9}
          metalness={0.03}
        />
      </mesh>
      <mesh position={[0, 0.02, LOBBY_CENTER_Z]} receiveShadow>
        <boxGeometry args={[8, 0.04, LOBBY_DEPTH - 2]} />
        <meshStandardMaterial
          color={museum.stoneDeep}
          roughness={0.88}
          metalness={0.04}
        />
      </mesh>
      <mesh
        position={[
          -ROOM_WIDTH / 2 - WALL_THICKNESS / 2,
          ROOM_HEIGHT / 2,
          LOBBY_CENTER_Z,
        ]}
        receiveShadow
      >
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, LOBBY_DEPTH]} />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>
      <mesh
        position={[
          ROOM_WIDTH / 2 + WALL_THICKNESS / 2,
          ROOM_HEIGHT / 2,
          LOBBY_CENTER_Z,
        ]}
        receiveShadow
      >
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, LOBBY_DEPTH]} />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>
      <OpeningWall
        z={LOBBY_BACK - WALL_THICKNESS / 2}
        width={ROOM_WIDTH + WALL_THICKNESS * 2}
        height={ROOM_HEIGHT}
        thickness={WALL_THICKNESS}
        openings={[
          { x: -LOBBY_DOOR_OFFSET, ...LOBBY_DOOR },
          { x: LOBBY_DOOR_OFFSET, ...LOBBY_DOOR },
        ]}
      />
      <mesh position={[0, ROOM_HEIGHT + WALL_THICKNESS / 2, LOBBY_CENTER_Z]}>
        <boxGeometry
          args={[ROOM_WIDTH + WALL_THICKNESS * 2, WALL_THICKNESS, LOBBY_DEPTH]}
        />
        <meshStandardMaterial
          color={museum.ceiling}
          roughness={0.86}
          metalness={0.02}
        />
      </mesh>

      {showLobbyDestinations ? (
        <>
          <DestinationDoor
            position={[-LOBBY_DOOR_OFFSET, 0, LOBBY_BACK + 0.16]}
            label="DATA STRUCTURES"
            subtitle="Enter"
            open
            onSelect={
              location === 'lobby' ? onSelectDataStructures : undefined
            }
            disabled={isTransitioning}
          />
          <DestinationDoor
            position={[LOBBY_DOOR_OFFSET, 0, LOBBY_BACK + 0.16]}
            label="ALGORITHMS"
            subtitle="Enter"
            open
            onSelect={
              location === 'lobby' ? onSelectAlgorithms : undefined
            }
            disabled={isTransitioning}
          />
        </>
      ) : (
        <>
          <Portal
            position={[-LOBBY_DOOR_OFFSET, LOBBY_DOOR.y, LOBBY_BACK + 0.16]}
            width={LOBBY_DOOR.width}
            height={LOBBY_DOOR.height}
            open
          />
          <Portal
            position={[LOBBY_DOOR_OFFSET, LOBBY_DOOR.y, LOBBY_BACK + 0.16]}
            width={LOBBY_DOOR.width}
            height={LOBBY_DOOR.height}
            open
          />
        </>
      )}

      <ExhibitHall
        centerX={DATA_STRUCTURES_CENTER_X}
        fillLightRef={dataStructuresFillRef}
      />
      <ExhibitHall
        centerX={ALGORITHMS_CENTER_X}
        fillLightRef={algorithmsFillRef}
      />

      <AlgorithmInstallation
        algorithm={location === 'algorithms' ? algorithmsAlgorithm : null}
        preview={location === 'algorithms' ? algorithmsPreview : null}
        playbackStep={location === 'algorithms' ? playbackStep : null}
        selectionPrompt={location === 'algorithms' ? selectionPrompt : null}
        setupNodeStates={location === 'algorithms' ? setupNodeStates : undefined}
        onSelectNode={location === 'algorithms' ? onSelectNode : undefined}
      />
      <AlgorithmInstallation
        position={DATA_STRUCTURE_INSTALLATION_POSITION}
        plateLabel={showingHashTableExhibit ? 'HASH TABLES' : 'LINKED LISTS'}
        emptyTitle={showingHashTableExhibit ? 'HASH TABLES' : 'LINKED LISTS'}
        emptySubtitle="Data Structures"
        idleLinkedListSnapshot={
          showingHashTableExhibit
            ? null
            : showingDoublyLinkedListExhibit
              ? IDLE_DOUBLY_LINKED_LIST_SNAPSHOT
              : IDLE_SINGLY_LINKED_LIST_SNAPSHOT
        }
        idleHashTableSnapshot={
          showingHashTableExhibit ? IDLE_HASH_TABLE_SNAPSHOT : null
        }
        algorithm={location === 'data-structures' ? dataStructureAlgorithm : null}
        preview={location === 'data-structures' ? dataStructurePreview : null}
        playbackStep={location === 'data-structures' ? playbackStep : null}
      />
      {COLUMNS.map((position) => (
        <Column key={position.join(',')} position={position} />
      ))}

      {FRONT_LIGHTS.map((position) => (
        <CeilingLight key={position.join(',')} position={position} />
      ))}
      {LOBBY_LIGHTS.map((position) => (
        <CeilingLight key={`lobby-${position.join(',')}`} position={position} />
      ))}
    </>
  )
}

export default MuseumScene
