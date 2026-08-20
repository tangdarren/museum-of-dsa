import { useMemo } from 'react'
import { Quaternion, Vector3 } from 'three'
import { hashTableLinkStyle } from '../../../theme/palette'
import type { HashTableLinkState } from '../../../types/hashTable'
import type { Vec3 } from '../../../navigation/destinations'

const UP = new Vector3(0, 1, 0)

type HashTableChainLinkProps = {
  sourcePosition: Vec3
  targetPosition: Vec3
  state?: HashTableLinkState
  sourceTrim: number
  targetTrim: number
}

function HashTableChainLink({
  sourcePosition,
  targetPosition,
  state = 'default',
  sourceTrim,
  targetTrim,
}: HashTableChainLinkProps) {
  const style = hashTableLinkStyle[state]
  const layout = useMemo(() => {
    const start = new Vector3(
      sourcePosition[0],
      sourcePosition[1],
      sourcePosition[2],
    )
    const end = new Vector3(
      targetPosition[0],
      targetPosition[1],
      targetPosition[2],
    )
    const direction = end.clone().sub(start)
    const distance = direction.length()

    if (distance < 0.001) {
      return null
    }

    const unit = direction.normalize()
    const trimmedStart = start.clone().add(unit.clone().multiplyScalar(sourceTrim))
    const trimmedEnd = end.clone().sub(unit.clone().multiplyScalar(targetTrim))
    const usable = Math.max(0.016, trimmedEnd.distanceTo(trimmedStart))
    const headLength = Math.min(0.028, usable * 0.32)
    const shaftLength = Math.max(0.01, usable - headLength)
    const shaftCenter = trimmedStart
      .clone()
      .add(unit.clone().multiplyScalar(shaftLength / 2))
    const headCenter = trimmedStart
      .clone()
      .add(unit.clone().multiplyScalar(shaftLength + headLength / 2))
    const quaternion = new Quaternion().setFromUnitVectors(UP, unit)

    return {
      shaftLength,
      headLength,
      shaftPosition: shaftCenter.toArray() as Vec3,
      headPosition: headCenter.toArray() as Vec3,
      quaternion,
    }
  }, [sourcePosition, sourceTrim, targetPosition, targetTrim])

  if (!layout) {
    return null
  }

  return (
    <group>
      <mesh position={layout.shaftPosition} quaternion={layout.quaternion}>
        <cylinderGeometry
          args={[style.radius, style.radius, layout.shaftLength, 10]}
        />
        <meshStandardMaterial
          color={style.color}
          emissive={style.emissive}
          emissiveIntensity={style.emissiveIntensity}
          roughness={0.42}
          metalness={0.22}
        />
      </mesh>
      <mesh position={layout.headPosition} quaternion={layout.quaternion}>
        <coneGeometry args={[style.radius * 2.2, layout.headLength, 10]} />
        <meshStandardMaterial
          color={style.color}
          emissive={style.emissive}
          emissiveIntensity={style.emissiveIntensity}
          roughness={0.36}
          metalness={0.28}
        />
      </mesh>
    </group>
  )
}

export default HashTableChainLink
