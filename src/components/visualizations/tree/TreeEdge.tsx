import { useMemo } from 'react'
import { Quaternion, Vector3 } from 'three'
import { graphEdgeStyle } from '../../../theme/palette'
import type { TreeEdgeState } from '../../../types/tree'
import type { Vec3 } from '../../../navigation/destinations'

const UP = new Vector3(0, 1, 0)

type TreeEdgeProps = {
  sourcePosition: Vec3
  targetPosition: Vec3
  state: TreeEdgeState
  radius: number
}

function TreeEdge({
  sourcePosition,
  targetPosition,
  state,
  radius,
}: TreeEdgeProps) {
  const style = graphEdgeStyle[state]
  const layout = useMemo(() => {
    const start = new Vector3(...sourcePosition)
    const end = new Vector3(...targetPosition)
    const direction = end.clone().sub(start)
    const distance = direction.length()
    const trim = radius * 2.35
    const length = Math.max(0.012, distance - trim)
    const midpoint = start.clone().add(end).multiplyScalar(0.5)
    midpoint.z -= 0.012
    const quaternion = new Quaternion().setFromUnitVectors(
      UP,
      direction.normalize(),
    )

    return {
      length,
      position: midpoint.toArray() as Vec3,
      quaternion,
    }
  }, [radius, sourcePosition, targetPosition])

  return (
    <mesh position={layout.position} quaternion={layout.quaternion}>
      <cylinderGeometry
        args={[style.radius * 1.45, style.radius * 1.45, layout.length, 12]}
      />
      <meshStandardMaterial
        color={style.color}
        emissive={style.emissive}
        emissiveIntensity={style.emissiveIntensity}
        roughness={0.42}
        metalness={0.22}
      />
    </mesh>
  )
}

export default TreeEdge
