import { useMemo } from 'react'
import { mapSortingSnapshotToBarStates } from '../../algorithms/mapSortingSnapshotToBars'
import { museum } from '../../../theme/palette'
import type { AlgorithmSortingSnapshot } from '../../../types/algorithmStep'
import {
  layoutSortingBars,
  sortingBarHeight,
  sortingBarX,
} from './layoutSortingBars'
import SortBar from './SortBar'

const EMPTY_VALUES: number[] = []

type SortVisualizationProps = {
  snapshot: AlgorithmSortingSnapshot | null
}

function SortVisualization({ snapshot }: SortVisualizationProps) {
  const values = snapshot?.values ?? EMPTY_VALUES
  const states = useMemo(
    () => mapSortingSnapshotToBarStates(snapshot),
    [snapshot],
  )
  const layout = useMemo(() => layoutSortingBars(values.length), [values.length])
  const maxValue = useMemo(
    () => Math.max(1, ...values.map((value) => Math.abs(value))),
    [values],
  )

  if (values.length === 0) {
    return <group />
  }

  return (
    <group>
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[layout.totalWidth + 0.1, 0.016, layout.depth + 0.05]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[layout.totalWidth + 0.16, 0.012, layout.depth + 0.08]} />
        <meshStandardMaterial
          color={museum.stoneDeep}
          roughness={0.8}
          metalness={0.06}
        />
      </mesh>
      {values.map((value, index) => (
        <SortBar
          key={index}
          value={value}
          state={states[index] ?? 'default'}
          x={sortingBarX(layout.startX, layout.width, layout.gap, index)}
          width={layout.width}
          depth={layout.depth}
          height={sortingBarHeight(value, maxValue)}
        />
      ))}
    </group>
  )
}

export default SortVisualization
