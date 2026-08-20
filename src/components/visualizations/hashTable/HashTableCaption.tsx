import { Text } from '@react-three/drei'
import { museum } from '../../../theme/palette'
import type { HashTableCaptionContent } from './describeHashTableCaption'
import { HASH_TABLE_CAPTION_Y, HASH_TABLE_VISUALIZATION_WIDTH } from './layoutHashTable'

type HashTableCaptionProps = {
  content: HashTableCaptionContent
}

function HashTableCaption({ content }: HashTableCaptionProps) {
  const meta = [
    content.keyLabel ? `Key ${content.keyLabel}` : null,
    content.bucketLabel ? `Bucket ${content.bucketLabel}` : null,
    content.collision ? 'Collision' : null,
  ]
    .filter((value): value is string => Boolean(value))
    .join('  ·  ')

  return (
    <group position={[0, HASH_TABLE_CAPTION_Y, 0.01]}>
      <mesh position={[0, 0.012, -0.012]}>
        <boxGeometry args={[HASH_TABLE_VISUALIZATION_WIDTH + 0.08, 0.12, 0.02]} />
        <meshStandardMaterial
          color={museum.plate}
          emissive={museum.tealDeep}
          emissiveIntensity={0.06}
          roughness={0.68}
          metalness={0.08}
        />
      </mesh>
      <Text
        position={[0, 0.032, 0.002]}
        fontSize={0.032}
        color={museum.brassMuted}
        outlineWidth={0.002}
        outlineColor={museum.slateDeep}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        maxWidth={HASH_TABLE_VISUALIZATION_WIDTH}
        textAlign="center"
      >
        {content.title.toUpperCase()}
      </Text>
      <Text
        position={[0, 0.002, 0.002]}
        fontSize={0.03}
        color={museum.cream}
        outlineWidth={0.002}
        outlineColor={museum.slateDeep}
        anchorX="center"
        anchorY="middle"
        maxWidth={HASH_TABLE_VISUALIZATION_WIDTH}
        textAlign="center"
      >
        {content.detail}
      </Text>
      {meta ? (
        <Text
          position={[0, -0.028, 0.002]}
          fontSize={0.022}
          color={museum.tealSoft}
          outlineWidth={0.002}
          outlineColor={museum.slateDeep}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
          maxWidth={HASH_TABLE_VISUALIZATION_WIDTH}
          textAlign="center"
        >
          {meta}
        </Text>
      ) : null}
    </group>
  )
}

export default HashTableCaption
