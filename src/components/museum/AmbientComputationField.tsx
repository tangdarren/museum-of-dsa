import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, Mesh, MeshBasicMaterial } from 'three'
import { museum } from '../../theme/palette'

const NODES: [number, number][] = [
  [-0.58, 0.38],
  [0.04, 0.46],
  [0.56, 0.24],
  [-0.5, -0.02],
  [0.06, 0.04],
  [0.52, -0.1],
  [-0.22, -0.4],
  [0.3, -0.42],
]

const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 4],
  [2, 5],
  [3, 4],
  [4, 5],
  [4, 6],
  [5, 7],
]

const NODE_COLORS = [
  new Color(museum.tealSoft),
  new Color(museum.brassMuted),
  new Color(museum.tealSoft),
  new Color(museum.cream),
  new Color(museum.brass),
  new Color(museum.tealSoft),
  new Color(museum.cream),
  new Color(museum.brassMuted),
]
const LINE_COLOR = new Color(museum.bronze)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type AmbientComputationFieldProps = {
  visible: boolean
}

function AmbientComputationField({ visible }: AmbientComputationFieldProps) {
  const nodeRefs = useRef<(Mesh | null)[]>([])
  const lineMats = useRef<(MeshBasicMaterial | null)[]>([])
  const reduced = useRef(prefersReducedMotion())
  const fade = useRef(visible ? 1 : 0)
  const links = useMemo(
    () =>
      LINKS.map(([from, to]) => {
        const [ax, ay] = NODES[from]
        const [bx, by] = NODES[to]
        const dx = bx - ax
        const dy = by - ay
        const length = Math.hypot(dx, dy)

        return {
          position: [(ax + bx) / 2, (ay + by) / 2, 0] as [number, number, number],
          rotation: [0, 0, Math.atan2(dy, dx)] as [number, number, number],
          length,
        }
      }),
    [],
  )

  useFrame((state, delta) => {
    const goal = visible ? 1 : 0
    fade.current = reduced.current
      ? goal
      : fade.current + (goal - fade.current) * Math.min(1, delta * 3.2)
    const show = fade.current
    const t = state.clock.elapsedTime

    if (reduced.current) {
      nodeRefs.current.forEach((mesh, index) => {
        const point = NODES[index]

        if (!mesh || !point) {
          return
        }

        mesh.position.set(point[0], point[1], 0)
        const material = mesh.material as MeshBasicMaterial
        material.opacity = show * 0.42
      })
      lineMats.current.forEach((material) => {
        if (material) {
          material.opacity = show * 0.22
        }
      })
      return
    }

    nodeRefs.current.forEach((mesh, index) => {
      const point = NODES[index]

      if (!mesh || !point) {
        return
      }

      mesh.position.set(
        point[0] + Math.sin(t * 0.22 + index * 0.7) * 0.018,
        point[1] + Math.cos(t * 0.18 + index * 0.55) * 0.016,
        0,
      )
      const material = mesh.material as MeshBasicMaterial
      material.opacity = show * (0.36 + Math.sin(t * 0.35 + index) * 0.1)
    })

    lineMats.current.forEach((material, index) => {
      if (!material) {
        return
      }

      material.opacity =
        show * (0.12 + (Math.sin(t * 0.28 + index * 0.9) * 0.5 + 0.5) * 0.18)
    })
  })

  return (
    <group>
      {NODES.map((point, index) => (
        <mesh
          key={`node-${point.join(',')}`}
          ref={(mesh) => {
            nodeRefs.current[index] = mesh
          }}
          position={[point[0], point[1], 0]}
        >
          <sphereGeometry args={[0.02, 12, 10]} />
          <meshBasicMaterial
            color={NODE_COLORS[index]}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}
      {links.map((link, index) => (
        <mesh
          key={`link-${link.position.join(',')}`}
          position={link.position}
          rotation={link.rotation}
        >
          <boxGeometry args={[link.length, 0.0035, 0.0035]} />
          <meshBasicMaterial
            ref={(material) => {
              lineMats.current[index] = material
            }}
            color={LINE_COLOR}
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default AmbientComputationField
