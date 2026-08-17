import type { TreeData } from '../types/tree'

export const SAMPLE_TREE: TreeData = {
  rootId: '8',
  nodes: [
    {
      id: '8',
      label: '8',
      value: 8,
      leftId: '4',
      rightId: '12',
      position: [0, 0, 0.4],
    },
    {
      id: '4',
      label: '4',
      value: 4,
      leftId: '2',
      rightId: '6',
      parentId: '8',
      position: [-0.42, 0, 0.05],
    },
    {
      id: '12',
      label: '12',
      value: 12,
      leftId: '10',
      rightId: '14',
      parentId: '8',
      position: [0.42, 0, 0.05],
    },
    {
      id: '2',
      label: '2',
      value: 2,
      parentId: '4',
      position: [-0.64, 0, -0.32],
    },
    {
      id: '6',
      label: '6',
      value: 6,
      parentId: '4',
      position: [-0.2, 0, -0.32],
    },
    {
      id: '10',
      label: '10',
      value: 10,
      parentId: '12',
      position: [0.2, 0, -0.32],
    },
    {
      id: '14',
      label: '14',
      value: 14,
      parentId: '12',
      position: [0.64, 0, -0.32],
    },
  ],
  edges: [
    { id: '8-4', source: '8', target: '4', side: 'left' },
    { id: '8-12', source: '8', target: '12', side: 'right' },
    { id: '4-2', source: '4', target: '2', side: 'left' },
    { id: '4-6', source: '4', target: '6', side: 'right' },
    { id: '12-10', source: '12', target: '10', side: 'left' },
    { id: '12-14', source: '12', target: '14', side: 'right' },
  ],
}

function uniqueSortedValues(tree: TreeData): number[] {
  return [...new Set(tree.nodes.map((node) => node.value))].sort(
    (left, right) => left - right,
  )
}

export function createDefaultTreeSearchTarget(tree: TreeData): number {
  const values = uniqueSortedValues(tree)

  if (values.length === 0) {
    return 0
  }

  return values[Math.min(2, values.length - 1)]
}

export function getTreeSearchTargetGroups(tree: TreeData): {
  present: number[]
  missing: number[]
} {
  const present = uniqueSortedValues(tree)

  if (present.length === 0) {
    return { present: [], missing: [0] }
  }

  const presentSet = new Set(present)
  const min = present[0]
  const max = present[present.length - 1]
  const rootValue = tree.nodes.find((node) => node.id === tree.rootId)?.value
  const missing: number[] = []

  if (!presentSet.has(min - 1)) {
    missing.push(min - 1)
  }

  if (
    rootValue !== undefined &&
    !presentSet.has(rootValue - 1) &&
    rootValue - 1 !== min - 1
  ) {
    missing.push(rootValue - 1)
  }

  if (!presentSet.has(max + 1)) {
    missing.push(max + 1)
  }

  return { present, missing }
}
