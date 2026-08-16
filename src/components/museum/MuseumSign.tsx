import { Text } from '@react-three/drei'

type MuseumSignProps = {
  position: [number, number, number]
  rotation?: [number, number, number]
  label: string
}

function MuseumSign({
  position,
  rotation = [0, 0, 0],
  label,
}: MuseumSignProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[3.4, 0.42, 0.06]} />
        <meshStandardMaterial color="#3c3c3a" />
      </mesh>
      <Text
        position={[0, 0, 0.04]}
        fontSize={0.16}
        color="#f3f0ea"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.14}
      >
        {label}
      </Text>
    </group>
  )
}

export default MuseumSign
