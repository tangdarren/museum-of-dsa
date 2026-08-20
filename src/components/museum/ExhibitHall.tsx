import type { Ref } from 'react'
import type { SpotLight } from 'three'
import { museum } from '../../theme/palette'
import {
  ALGORITHMS_BACK,
  ALGORITHMS_CENTER_Z,
  ALGORITHMS_ROOM_DEPTH,
  ALGORITHMS_ROOM_WIDTH,
  ROOM_HEIGHT,
  WALL_THICKNESS,
} from '../../navigation/destinations'

type ExhibitHallProps = {
  centerX: number
  fillLightRef?: Ref<SpotLight | null>
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

function ExhibitHall({ centerX, fillLightRef }: ExhibitHallProps) {
  return (
    <group>
      <mesh
        position={[centerX, -WALL_THICKNESS / 2, ALGORITHMS_CENTER_Z]}
        receiveShadow
      >
        <boxGeometry
          args={[ALGORITHMS_ROOM_WIDTH, WALL_THICKNESS, ALGORITHMS_ROOM_DEPTH]}
        />
        <meshStandardMaterial
          color={museum.stone}
          roughness={0.9}
          metalness={0.03}
        />
      </mesh>
      <mesh
        position={[centerX, 0.025, ALGORITHMS_CENTER_Z - 0.4]}
        receiveShadow
      >
        <boxGeometry args={[11.2, 0.05, 10.4]} />
        <meshStandardMaterial
          color={museum.stoneDeep}
          roughness={0.86}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[centerX, 0.04, ALGORITHMS_CENTER_Z + 4.8]}>
        <boxGeometry args={[11.35, 0.02, 0.06]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[centerX, 0.04, ALGORITHMS_CENTER_Z - 5.6]}>
        <boxGeometry args={[11.35, 0.02, 0.06]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[centerX - 5.6, 0.04, ALGORITHMS_CENTER_Z - 0.4]}>
        <boxGeometry args={[0.06, 0.02, 10.55]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[centerX + 5.6, 0.04, ALGORITHMS_CENTER_Z - 0.4]}>
        <boxGeometry args={[0.06, 0.02, 10.55]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
      <mesh
        position={[
          centerX - ALGORITHMS_ROOM_WIDTH / 2 + 0.04,
          0.7,
          ALGORITHMS_CENTER_Z,
        ]}
        receiveShadow
      >
        <boxGeometry args={[0.08, 1.4, ALGORITHMS_ROOM_DEPTH - 0.3]} />
        <meshStandardMaterial
          color={museum.wainscot}
          roughness={0.8}
          metalness={0.04}
        />
      </mesh>
      <mesh
        position={[
          centerX + ALGORITHMS_ROOM_WIDTH / 2 - 0.04,
          0.7,
          ALGORITHMS_CENTER_Z,
        ]}
        receiveShadow
      >
        <boxGeometry args={[0.08, 1.4, ALGORITHMS_ROOM_DEPTH - 0.3]} />
        <meshStandardMaterial
          color={museum.wainscot}
          roughness={0.8}
          metalness={0.04}
        />
      </mesh>
      <mesh
        position={[centerX, 0.7, ALGORITHMS_BACK + 0.04]}
        receiveShadow
      >
        <boxGeometry args={[ALGORITHMS_ROOM_WIDTH - 0.2, 1.4, 0.08]} />
        <meshStandardMaterial
          color={museum.wainscot}
          roughness={0.8}
          metalness={0.04}
        />
      </mesh>
      <mesh
        position={[
          centerX - ALGORITHMS_ROOM_WIDTH / 2 + 0.05,
          0.06,
          ALGORITHMS_CENTER_Z,
        ]}
      >
        <boxGeometry args={[0.06, 0.12, ALGORITHMS_ROOM_DEPTH - 0.2]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.52}
        />
      </mesh>
      <mesh
        position={[
          centerX + ALGORITHMS_ROOM_WIDTH / 2 - 0.05,
          0.06,
          ALGORITHMS_CENTER_Z,
        ]}
      >
        <boxGeometry args={[0.06, 0.12, ALGORITHMS_ROOM_DEPTH - 0.2]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[centerX, 0.06, ALGORITHMS_BACK + 0.05]}>
        <boxGeometry args={[ALGORITHMS_ROOM_WIDTH - 0.16, 0.12, 0.06]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.52}
        />
      </mesh>
      <mesh
        position={[
          centerX - ALGORITHMS_ROOM_WIDTH / 2 - WALL_THICKNESS / 2,
          ROOM_HEIGHT / 2,
          ALGORITHMS_CENTER_Z,
        ]}
        receiveShadow
      >
        <boxGeometry
          args={[WALL_THICKNESS, ROOM_HEIGHT, ALGORITHMS_ROOM_DEPTH]}
        />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>
      <mesh
        position={[
          centerX + ALGORITHMS_ROOM_WIDTH / 2 + WALL_THICKNESS / 2,
          ROOM_HEIGHT / 2,
          ALGORITHMS_CENTER_Z,
        ]}
        receiveShadow
      >
        <boxGeometry
          args={[WALL_THICKNESS, ROOM_HEIGHT, ALGORITHMS_ROOM_DEPTH]}
        />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>
      <mesh
        position={[
          centerX,
          ROOM_HEIGHT / 2,
          ALGORITHMS_BACK - WALL_THICKNESS / 2,
        ]}
        receiveShadow
      >
        <boxGeometry
          args={[
            ALGORITHMS_ROOM_WIDTH + WALL_THICKNESS * 2,
            ROOM_HEIGHT,
            WALL_THICKNESS,
          ]}
        />
        <meshStandardMaterial
          color={museum.wall}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>
      <mesh
        position={[
          centerX,
          ROOM_HEIGHT + WALL_THICKNESS / 2,
          ALGORITHMS_CENTER_Z,
        ]}
      >
        <boxGeometry
          args={[
            ALGORITHMS_ROOM_WIDTH + WALL_THICKNESS * 2,
            WALL_THICKNESS,
            ALGORITHMS_ROOM_DEPTH,
          ]}
        />
        <meshStandardMaterial
          color={museum.ceiling}
          roughness={0.86}
          metalness={0.02}
        />
      </mesh>
      <spotLight
        ref={fillLightRef}
        position={[centerX, 8.2, ALGORITHMS_CENTER_Z]}
        angle={0.48}
        penumbra={0.7}
        intensity={10}
        distance={14}
        color={museum.lightWarm}
      />
      <CeilingLight
        position={[centerX, ROOM_HEIGHT - 0.12, ALGORITHMS_CENTER_Z]}
      />
      <pointLight
        position={[centerX - 5.15, 4.55, ALGORITHMS_CENTER_Z]}
        intensity={3.1}
        distance={8}
        decay={2}
        color={museum.lightWarm}
      />
      <pointLight
        position={[centerX + 5.15, 4.55, ALGORITHMS_CENTER_Z]}
        intensity={3.1}
        distance={8}
        decay={2}
        color={museum.lightWarm}
      />
    </group>
  )
}

export default ExhibitHall
