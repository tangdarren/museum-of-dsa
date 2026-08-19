import type {
  AlgorithmAuxiliaryData,
  AlgorithmInspection,
  AlgorithmStep,
} from '../types/algorithmStep'
import type {
  LinkedListData,
  LinkedListMutationPosition,
  LinkedListNode,
  LinkedListPointerChange,
} from '../types/linkedList'
import { createLinkedListStep } from './createLinkedListStep'
import {
  createLinkedListNode,
  createLinkedListSnapshot,
  createLinkedListState,
  createUniqueLinkedListNodeId,
  formatLinkedListChain,
  getLinkedListLength,
  indexLinkedListNodes,
  resolveLinkedListInsertIndex,
  setLinkedListNext,
  type LinkedListSnapshotHighlights,
} from './linkedListShared'

function insertStartDescription(
  value: number,
  position: LinkedListMutationPosition,
  length: number,
): string {
  if (length === 0) {
    if (position.at === 'tail') {
      return `The list is empty. Insert ${value} as the first node, which becomes both HEAD and TAIL.`
    }

    return `The list is empty. Insert ${value} at HEAD.`
  }

  if (position.at === 'head') {
    return `Insert ${value} at HEAD.`
  }

  if (position.at === 'tail') {
    return `Insert ${value} at TAIL. Walk from HEAD to the last node.`
  }

  if (position.index === 0) {
    return `Insert ${value} at index 0, which is HEAD.`
  }

  if (position.index === length) {
    return `Insert ${value} at index ${position.index}, which appends after the current tail.`
  }

  return `Insert ${value} at index ${position.index}. Walk from HEAD to the predecessor.`
}

function invalidInsertDescription(
  position: LinkedListMutationPosition,
  length: number,
): string {
  if (position.at !== 'index') {
    return 'The insertion position is invalid. The list is unchanged.'
  }

  if (!Number.isInteger(position.index)) {
    return `Cannot insert at index ${position.index}. Insertion indexes must be integers from 0 through ${length}.`
  }

  if (position.index < 0) {
    return `Cannot insert at index ${position.index}. Insertion indexes must be 0 or greater.`
  }

  return `Cannot insert at index ${position.index}. The list has length ${length}, so a new node can be placed at indexes 0 through ${length}.`
}

function nodeLabel(
  node: LinkedListNode | undefined,
  fallback = 'NULL',
) {
  return node?.label ?? fallback
}

export function generateSinglyLinkedListInsertSteps(
  list: LinkedListData,
  value: number,
  position: LinkedListMutationPosition,
): AlgorithmStep[] {
  const state = createLinkedListState(list)
  const nodesById = indexLinkedListNodes(state.nodes)
  const steps: AlgorithmStep[] = []
  const length = getLinkedListLength(state)
  const insertIndex = resolveLinkedListInsertIndex(position, length)
  const inserting: AlgorithmAuxiliaryData = {
    label: 'Inserting',
    values: [String(value)],
  }

  const addStep = (
    id: string,
    description: string,
    highlights: LinkedListSnapshotHighlights = {},
    inspection?: AlgorithmInspection,
  ) => {
    steps.push(
      createLinkedListStep({
        id,
        description,
        snapshot: createLinkedListSnapshot(state, highlights),
        auxiliaryData: inserting,
        inspection,
      }),
    )
  }

  if (insertIndex === null) {
    addStep(
      'singly-insert-start',
      invalidInsertDescription(position, length),
      { phase: 'start' },
    )
    addStep(
      'singly-insert-complete',
      'The list is unchanged.',
      { phase: 'complete' },
    )
    return steps
  }

  addStep(
    'singly-insert-start',
    insertStartDescription(value, position, length),
    {
      phase: 'start',
      currentNodeId: state.headId ?? undefined,
    },
  )

  let predecessor: LinkedListNode | undefined
  let successor: LinkedListNode | undefined = state.headId
    ? nodesById.get(state.headId)
    : undefined
  const seen = new Set<string>()
  let index = 0

  while (successor && !seen.has(successor.id) && index < insertIndex) {
    const node: LinkedListNode = successor
    seen.add(node.id)
    state.metrics.visits += 1
    state.currentNodeId = node.id
    predecessor = node

    const isPredecessor = index === insertIndex - 1
    const next = node.nextId ? nodesById.get(node.nextId) : undefined

    addStep(
      `singly-insert-visit-${node.id}`,
      isPredecessor
        ? `Visit ${node.label} at index ${index}. This node sits just before the insertion point.`
        : `Visit ${node.label} at index ${index}. Follow next to ${nodeLabel(next)}.`,
      {
        phase: 'traverse',
        currentNodeId: node.id,
        visitedNodeIds: [...seen].filter((id) => id !== node.id),
        highlightedNodeIds: node.nextId ? [node.nextId] : [],
      },
    )

    successor = next
    index += 1
  }

  const newNodeId = createUniqueLinkedListNodeId(state.nodes, value)
  const newNode = createLinkedListNode(newNodeId, value, successor?.id)
  state.nodes.push(newNode)
  nodesById.set(newNode.id, newNode)
  state.metrics.pointerUpdates += 1

  const createChanges: LinkedListPointerChange[] = [
    {
      pointer: 'next',
      fromNodeId: newNode.id,
      toNodeId: successor?.id ?? null,
    },
  ]

  addStep(
    `singly-insert-create-${newNode.id}`,
    successor
      ? `Create a new node ${newNode.label}. Point its next reference to ${successor.label}.`
      : `Create a new node ${newNode.label}. Point its next reference to NULL.`,
    {
      phase: 'relink',
      currentNodeId: newNode.id,
      insertingNodeId: newNode.id,
      highlightedNodeIds: [
        ...(predecessor ? [predecessor.id] : []),
        ...(successor ? [successor.id] : []),
      ],
      pointerChanges: createChanges,
    },
    {
      title: `Create ${newNode.label}`,
      lines: [
        `New node ${newNode.label}`,
        `next → ${nodeLabel(successor)}`,
      ],
    },
  )

  if (predecessor) {
    setLinkedListNext(predecessor, newNode.id)
    state.metrics.pointerUpdates += 1

    const relinkChanges: LinkedListPointerChange[] = [
      {
        pointer: 'next',
        fromNodeId: predecessor.id,
        toNodeId: newNode.id,
      },
    ]

    if (insertIndex === length) {
      const previousTailId = state.tailId ?? predecessor.id
      state.tailId = newNode.id
      state.metrics.pointerUpdates += 1
      relinkChanges.push({
        pointer: 'tail',
        fromNodeId: previousTailId,
        toNodeId: newNode.id,
      })
    }

    addStep(
      `singly-insert-relink-${predecessor.id}`,
      insertIndex === length
        ? `Update ${predecessor.label}.next from ${nodeLabel(successor)} to ${newNode.label}, then point TAIL to ${newNode.label}.`
        : `Update ${predecessor.label}.next from ${nodeLabel(successor)} to ${newNode.label}.`,
      {
        phase: 'relink',
        currentNodeId: newNode.id,
        insertingNodeId: newNode.id,
        highlightedNodeIds: [predecessor.id, newNode.id],
        pointerChanges: relinkChanges,
      },
      {
        title: `Update ${predecessor.label}.next`,
        lines: [
          `${predecessor.label}.next was ${nodeLabel(successor)}`,
          `${predecessor.label}.next is now ${newNode.label}`,
        ],
      },
    )
  } else {
    const previousHeadId = state.headId
    state.headId = newNode.id
    state.metrics.pointerUpdates += 1

    const relinkChanges: LinkedListPointerChange[] = [
      {
        pointer: 'head',
        fromNodeId: previousHeadId,
        toNodeId: newNode.id,
      },
    ]

    if (length === 0) {
      state.tailId = newNode.id
      state.metrics.pointerUpdates += 1
      relinkChanges.push({
        pointer: 'tail',
        fromNodeId: null,
        toNodeId: newNode.id,
      })
    }

    addStep(
      'singly-insert-relink-head',
      length === 0
        ? `Point HEAD and TAIL to ${newNode.label}.`
        : `Point HEAD from ${nodeLabel(
            previousHeadId ? nodesById.get(previousHeadId) : undefined,
            'NULL',
          )} to ${newNode.label}.`,
      {
        phase: 'relink',
        currentNodeId: newNode.id,
        insertingNodeId: newNode.id,
        highlightedNodeIds: successor ? [successor.id] : [],
        pointerChanges: relinkChanges,
      },
      {
        title: 'Update HEAD',
        lines:
          length === 0
            ? [
                'HEAD was NULL',
                `HEAD is now ${newNode.label}`,
                `TAIL is now ${newNode.label}`,
              ]
            : [
                `HEAD was ${nodeLabel(
                  previousHeadId ? nodesById.get(previousHeadId) : undefined,
                  'NULL',
                )}`,
                `HEAD is now ${newNode.label}`,
              ],
      },
    )
  }

  addStep(
    'singly-insert-complete',
    `Inserted ${newNode.label}. The list is now ${formatLinkedListChain(state)}.`,
    {
      phase: 'complete',
      currentNodeId: newNode.id,
      insertingNodeId: newNode.id,
    },
  )

  return steps
}
