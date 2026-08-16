import { museum } from '../../theme/palette'

type MuseumPedestalProps = {
  position: [number, number, number]
}

function MuseumPedestal({ position }: MuseumPedestalProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.84, 1.15]} />
        <meshStandardMaterial
          color={museum.stone}
          roughness={0.82}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, 0.87, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.28, 0.06, 1.28]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.5}
        />
      </mesh>
    </group>
  )
}

export default MuseumPedestal
