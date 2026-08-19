import { Text } from '@react-three/drei'
import { museum } from '../../../theme/palette'
import type { Vec3 } from '../../../navigation/destinations'

type LinkedListMarkerProps = {
  label: string
  position: Vec3
  active?: boolean
  size?: 'label' | 'null'
}

function LinkedListMarker({
  label,
  position,
  active = false,
  size = 'label',
}: LinkedListMarkerProps) {
  const isNull = size === 'null'
  const color = active ? museum.gold : isNull ? museum.brassMuted : museum.cream
  const fontSize = isNull ? 0.038 : 0.034

  return (
    <group position={position}>
      {isNull ? (
        <mesh>
          <boxGeometry args={[0.11, 0.07, 0.02]} />
          <meshStandardMaterial
            color={active ? museum.gold : museum.slate}
            emissive={active ? museum.gold : museum.tealDeep}
            emissiveIntensity={active ? 0.18 : 0.04}
            roughness={0.52}
            metalness={0.12}
          />
        </mesh>
      ) : null}
      <Text
        position={isNull ? [0, 0, 0.014] : [0, 0, 0]}
        fontSize={fontSize}
        color={color}
        outlineWidth={fontSize * 0.08}
        outlineColor={museum.slateDeep}
        anchorX="center"
        anchorY="middle"
        letterSpacing={isNull ? 0.04 : 0.12}
      >
        {label}
      </Text>
    </group>
  )
}

export default LinkedListMarker
