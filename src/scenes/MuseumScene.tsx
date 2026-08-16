import { PerspectiveCamera, Text } from '@react-three/drei'
import MuseumPedestal from '../components/museum/MuseumPedestal'
import MuseumSign from '../components/museum/MuseumSign'

const WIDTH = 32
const DEPTH = 28
const HEIGHT = 9
const WALL = 0.3

const COLUMNS: [number, number, number][] = [
  [-7.2, HEIGHT / 2, -8.5],
  [7.2, HEIGHT / 2, -8.5],
  [-7.2, HEIGHT / 2, 3.5],
  [7.2, HEIGHT / 2, 3.5],
]

const CEILING_LIGHTS: [number, number, number][] = [
  [-8, HEIGHT - 0.12, -7],
  [0, HEIGHT - 0.12, -7],
  [8, HEIGHT - 0.12, -7],
  [-8, HEIGHT - 0.12, 3],
  [0, HEIGHT - 0.12, 3],
  [8, HEIGHT - 0.12, 3],
]

function Column({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[0.58, HEIGHT, 0.58]} />
      <meshStandardMaterial color="#e2ddd4" />
    </mesh>
  )
}

function Portal({
  position,
  rotation = [0, 0, 0],
  width,
  height,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  width: number
  height: number
}) {
  const frame = 0.16

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[width, height, 0.22]} />
        <meshStandardMaterial color="#2b2b29" />
      </mesh>
      <mesh position={[0, height / 2 + frame / 2, 0.02]}>
        <boxGeometry args={[width + frame * 2, frame, 0.14]} />
        <meshStandardMaterial color="#4a4a47" />
      </mesh>
      <mesh position={[0, -height / 2 - frame / 2, 0.02]}>
        <boxGeometry args={[width + frame * 2, frame, 0.14]} />
        <meshStandardMaterial color="#4a4a47" />
      </mesh>
      <mesh position={[-width / 2 - frame / 2, 0, 0.02]}>
        <boxGeometry args={[frame, height, 0.14]} />
        <meshStandardMaterial color="#4a4a47" />
      </mesh>
      <mesh position={[width / 2 + frame / 2, 0, 0.02]}>
        <boxGeometry args={[frame, height, 0.14]} />
        <meshStandardMaterial color="#4a4a47" />
      </mesh>
    </group>
  )
}

function MuseumScene() {
  const back = -DEPTH / 2

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3.35, 12.2]} fov={46} />
      <color attach="background" args={['#d9d5cd']} />

      <hemisphereLight args={['#f4f1ea', '#b8b3a8', 0.38]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[5, 14, 7]}
        intensity={0.72}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />
      <spotLight
        position={[0, 8.2, -6]}
        angle={0.42}
        penumbra={0.7}
        intensity={18}
        distance={18}
      />

      <mesh position={[0, -WALL / 2, 0]} receiveShadow>
        <boxGeometry args={[WIDTH, WALL, DEPTH]} />
        <meshStandardMaterial color="#c8c3b8" />
      </mesh>
      <mesh position={[0, 0.02, -1.5]} receiveShadow>
        <boxGeometry args={[10, 0.04, 12]} />
        <meshStandardMaterial color="#b7b1a6" />
      </mesh>

      <mesh position={[0, HEIGHT / 2, back - WALL / 2]} receiveShadow>
        <boxGeometry args={[WIDTH + WALL * 2, HEIGHT, WALL]} />
        <meshStandardMaterial color="#f3f0ea" />
      </mesh>
      <mesh position={[-WIDTH / 2 - WALL / 2, HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[WALL, HEIGHT, DEPTH]} />
        <meshStandardMaterial color="#f3f0ea" />
      </mesh>
      <mesh position={[WIDTH / 2 + WALL / 2, HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[WALL, HEIGHT, DEPTH]} />
        <meshStandardMaterial color="#f3f0ea" />
      </mesh>
      <mesh position={[-11, HEIGHT / 2, DEPTH / 2 + WALL / 2]} receiveShadow>
        <boxGeometry args={[10, HEIGHT, WALL]} />
        <meshStandardMaterial color="#f3f0ea" />
      </mesh>
      <mesh position={[11, HEIGHT / 2, DEPTH / 2 + WALL / 2]} receiveShadow>
        <boxGeometry args={[10, HEIGHT, WALL]} />
        <meshStandardMaterial color="#f3f0ea" />
      </mesh>
      <mesh position={[0, HEIGHT - 0.7, DEPTH / 2 + WALL / 2]} receiveShadow>
        <boxGeometry args={[12, 1.4, WALL]} />
        <meshStandardMaterial color="#f3f0ea" />
      </mesh>

      <mesh position={[0, HEIGHT + WALL / 2, 0]}>
        <boxGeometry args={[WIDTH + WALL * 2, WALL, DEPTH]} />
        <meshStandardMaterial color="#ebe7df" />
      </mesh>
      <mesh position={[0, HEIGHT - 0.18, -1]}>
        <boxGeometry args={[18, 0.08, 16]} />
        <meshStandardMaterial color="#e4dfd6" />
      </mesh>

      <mesh position={[0, 6.05, back + 0.1]} receiveShadow>
        <boxGeometry args={[13.5, 2.5, 0.12]} />
        <meshStandardMaterial color="#3c3c3a" />
      </mesh>
      <Text
        position={[0, 6.28, back + 0.18]}
        fontSize={0.74}
        color="#f4f1ea"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        MUSEUM OF DSA
      </Text>
      <Text
        position={[0, 5.48, back + 0.18]}
        fontSize={0.26}
        color="#c5c0b6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.14}
      >
        Data Structures & Algorithms
      </Text>

      <Portal position={[0, 2.05, back + 0.16]} width={4.6} height={3.7} />
      <Portal
        position={[-WIDTH / 2 + 0.16, 2.05, -1]}
        rotation={[0, Math.PI / 2, 0]}
        width={4.2}
        height={3.7}
      />
      <Portal
        position={[WIDTH / 2 - 0.16, 2.05, -1]}
        rotation={[0, -Math.PI / 2, 0]}
        width={4.2}
        height={3.7}
      />

      <MuseumSign position={[0, 4.22, back + 0.18]} label="GRAPH THEORY" />
      <MuseumSign
        position={[-WIDTH / 2 + 0.18, 4.22, -1]}
        rotation={[0, Math.PI / 2, 0]}
        label="DATA STRUCTURES"
      />
      <MuseumSign
        position={[WIDTH / 2 - 0.18, 4.22, -1]}
        rotation={[0, -Math.PI / 2, 0]}
        label="ALGORITHMS"
      />

      {COLUMNS.map((position) => (
        <Column key={position.join(',')} position={position} />
      ))}

      <MuseumPedestal position={[-4.4, 0, 3.6]} />
      <MuseumPedestal position={[0, 0, 2.2]} />
      <MuseumPedestal position={[4.4, 0, 3.6]} />

      {CEILING_LIGHTS.map((position) => (
        <group key={position.join(',')} position={position}>
          <mesh>
            <boxGeometry args={[1.1, 0.08, 1.1]} />
            <meshStandardMaterial color="#f7f4ee" />
          </mesh>
          <pointLight intensity={4.2} distance={11} decay={2} />
        </group>
      ))}
    </>
  )
}

export default MuseumScene
