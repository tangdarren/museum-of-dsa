import { PerspectiveCamera } from '@react-three/drei'

const WIDTH = 24
const DEPTH = 20
const HEIGHT = 8
const WALL = 0.25

function MuseumScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3.6, 12]} fov={50} />
      <color attach="background" args={['#e8e6e1']} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 12, 8]} intensity={1.05} />
      <directionalLight position={[-5, 7, 3]} intensity={0.35} />

      <mesh position={[0, -WALL / 2, 0]}>
        <boxGeometry args={[WIDTH, WALL, DEPTH]} />
        <meshStandardMaterial color="#cfc9be" />
      </mesh>

      <mesh position={[0, HEIGHT / 2, -DEPTH / 2 - WALL / 2]}>
        <boxGeometry args={[WIDTH + WALL * 2, HEIGHT, WALL]} />
        <meshStandardMaterial color="#f4f1ea" />
      </mesh>

      <mesh position={[-WIDTH / 2 - WALL / 2, HEIGHT / 2, 0]}>
        <boxGeometry args={[WALL, HEIGHT, DEPTH]} />
        <meshStandardMaterial color="#f4f1ea" />
      </mesh>

      <mesh position={[WIDTH / 2 + WALL / 2, HEIGHT / 2, 0]}>
        <boxGeometry args={[WALL, HEIGHT, DEPTH]} />
        <meshStandardMaterial color="#f4f1ea" />
      </mesh>

      <mesh position={[0, HEIGHT + WALL / 2, 0]}>
        <boxGeometry args={[WIDTH + WALL * 2, WALL, DEPTH]} />
        <meshStandardMaterial color="#ece8e0" />
      </mesh>
    </>
  )
}

export default MuseumScene
