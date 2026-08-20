import {
  createLinkedListSnapshot,
  createLinkedListState,
  getLinkedListNodeOrder,
} from '../algorithms/linkedListShared'
import type { AlgorithmLinkedListSnapshot } from '../types/algorithmStep'
import type {
  LinkedListData,
  LinkedListMutationPosition,
  LinkedListVariant,
} from '../types/linkedList'

export const DEFAULT_LINKED_LIST_SEARCH_TARGET = 9
export const MISSING_LINKED_LIST_SEARCH_TARGET = 11
export const DEFAULT_LINKED_LIST_INSERT_VALUE = 5
export const LINKED_LIST_INSERT_VALUES = [5, 3] as const
export const DEFAULT_LINKED_LIST_INSERT_POSITION: LinkedListMutationPosition = {
  at: 'head',
}
export const DEFAULT_LINKED_LIST_DELETE_POSITION: LinkedListMutationPosition = {
  at: 'tail',
}

export const LINKED_LIST_MUTATION_POSITIONS: {
  label: string
  position: LinkedListMutationPosition
}[] = [
  { label: 'Head', position: { at: 'head' } },
  { label: 'Index 2', position: { at: 'index', index: 2 } },
  { label: 'Tail', position: { at: 'tail' } },
]

export const SAMPLE_LINKED_LIST: LinkedListData = {
  variant: 'singly',
  headId: '4',
  tailId: '6',
  nodes: [
    {
      id: '4',
      label: '4',
      value: 4,
      nextId: '7',
    },
    {
      id: '7',
      label: '7',
      value: 7,
      nextId: '2',
    },
    {
      id: '2',
      label: '2',
      value: 2,
      nextId: '9',
    },
    {
      id: '9',
      label: '9',
      value: 9,
      nextId: '6',
    },
    {
      id: '6',
      label: '6',
      value: 6,
    },
  ],
}

export const SAMPLE_DOUBLY_LINKED_LIST: LinkedListData = {
  variant: 'doubly',
  headId: '4',
  tailId: '6',
  nodes: [
    {
      id: '4',
      label: '4',
      value: 4,
      nextId: '7',
    },
    {
      id: '7',
      label: '7',
      value: 7,
      nextId: '2',
      previousId: '4',
    },
    {
      id: '2',
      label: '2',
      value: 2,
      nextId: '9',
      previousId: '7',
    },
    {
      id: '9',
      label: '9',
      value: 9,
      nextId: '6',
      previousId: '2',
    },
    {
      id: '6',
      label: '6',
      value: 6,
      previousId: '9',
    },
  ],
}

export function getSampleLinkedList(variant: LinkedListVariant): LinkedListData {
  return variant === 'doubly' ? SAMPLE_DOUBLY_LINKED_LIST : SAMPLE_LINKED_LIST
}

export function createSampleLinkedListSnapshot(
  list: LinkedListData,
): AlgorithmLinkedListSnapshot {
  return createLinkedListSnapshot(createLinkedListState(list))
}

export function createDefaultLinkedListSearchTarget(): number {
  return DEFAULT_LINKED_LIST_SEARCH_TARGET
}

export function getLinkedListSearchTargetGroups(list: LinkedListData): {
  present: number[]
  missing: number[]
} {
  const nodesById = new Map(list.nodes.map((node) => [node.id, node]))
  const present = getLinkedListNodeOrder(list).flatMap((id) => {
    const value = nodesById.get(id)?.value
    return value === undefined ? [] : [value]
  })

  return {
    present,
    missing: [MISSING_LINKED_LIST_SEARCH_TARGET],
  }
}

export function linkedListMutationPositionKey(
  position: LinkedListMutationPosition,
): string {
  return position.at === 'index' ? `index-${position.index}` : position.at
}
