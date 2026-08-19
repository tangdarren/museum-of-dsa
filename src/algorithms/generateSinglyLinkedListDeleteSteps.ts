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
  createLinkedListSnapshot,
  createLinkedListState,
  formatLinkedListChain,
  getLinkedListLength,
  indexLinkedListNodes,
  resolveLinkedListDeleteIndex,
  setLinkedListNext,
  type LinkedListSnapshotHighlights,
} from './linkedListShared'

function deleteStartDescription(
  position: LinkedListMutationPosition,
  length: number,
): string {
  if (position.at === 'head') {
    return 'Delete the HEAD node.'
  }

  if (position.at === 'tail') {
    return length <= 1
      ? 'Delete the TAIL node.'
      : 'Delete the TAIL node. Walk from HEAD to the predecessor of TAIL.'
  }

  if (position.index === 0) {
    return 'Delete the node at index 0, which is HEAD.'
  }

  if (position.index === length - 1) {
    return `Delete the node at index ${position.index}, which is TAIL. Walk from HEAD to its predecessor.`
  }

  return `Delete the node at index ${position.index}. Walk from HEAD to its predecessor.`
}

function invalidDeleteDescription(
  position: LinkedListMutationPosition,
  length: number,
): string {
  if (length === 0) {
    if (position.at === 'head') {
      return 'The list is empty. HEAD is already NULL, so there is nothing to delete.'
    }

    if (position.at === 'tail') {
      return 'The list is empty. TAIL is already NULL, so there is nothing to delete.'
    }

    return 'The list is empty, so there is nothing to delete.'
  }

  if (position.at !== 'index') {
    return 'The delete position is invalid. The list is unchanged.'
  }

  if (!Number.isInteger(position.index)) {
    return `Cannot delete index ${position.index}. Delete indexes must be integers from 0 through ${length - 1}.`
  }

  if (position.index < 0) {
    return `Cannot delete index ${position.index}. Delete indexes must be 0 or greater.`
  }

  return `Cannot delete index ${position.index}. Valid indexes are 0 through ${length - 1}.`
}

function nodeLabel(
  node: LinkedListNode | undefined,
  fallback = 'NULL',
) {
  return node?.label ?? fallback
}

function deletingAuxiliary(label: string): AlgorithmAuxiliaryData {
  return {
    label: 'Deleting',
    values: [label],
  }
}

export function generateSinglyLinkedListDeleteSteps(
  list: LinkedListData,
  position: LinkedListMutationPosition,
): AlgorithmStep[] {
  const state = createLinkedListState(list)
  const nodesById = indexLinkedListNodes(state.nodes)
  const steps: AlgorithmStep[] = []
  const length = getLinkedListLength(state)
  const deleteIndex = resolveLinkedListDeleteIndex(position, length)
  let auxiliary = deletingAuxiliary(
    position.at === 'head'
      ? 'HEAD'
      : position.at === 'tail'
        ? 'TAIL'
        : `index ${position.index}`,
  )

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
        auxiliaryData: auxiliary,
        inspection,
      }),
    )
  }

  if (deleteIndex === null) {
    addStep(
      'singly-delete-start',
      invalidDeleteDescription(position, length),
      { phase: 'start' },
    )
    addStep(
      'singly-delete-complete',
      'The list is unchanged.',
      { phase: 'complete' },
    )
    return steps
  }

  addStep(
    'singly-delete-start',
    deleteStartDescription(position, length),
    {
      phase: 'start',
      currentNodeId: state.headId ?? undefined,
    },
  )

  let predecessor: LinkedListNode | undefined
  let target: LinkedListNode | undefined = state.headId
    ? nodesById.get(state.headId)
    : undefined
  const visited: string[] = []
  const seen = new Set<string>()
  let index = 0

  while (target && !seen.has(target.id) && index < deleteIndex) {
    const node: LinkedListNode = target
    seen.add(node.id)
    visited.push(node.id)
    state.metrics.visits += 1
    state.currentNodeId = node.id
    predecessor = node

    const next = node.nextId ? nodesById.get(node.nextId) : undefined

    addStep(
      `singly-delete-visit-${node.id}`,
      index === deleteIndex - 1
        ? `Visit ${node.label} at index ${index}. This node sits just before the node to delete.`
        : `Visit ${node.label} at index ${index}. Follow next to ${nodeLabel(next)}.`,
      {
        phase: 'traverse',
        currentNodeId: node.id,
        visitedNodeIds: visited.filter((id) => id !== node.id),
        highlightedNodeIds: node.nextId ? [node.nextId] : [],
      },
    )

    target = next
    index += 1
  }

  if (!target) {
    addStep(
      'singly-delete-complete',
      'The delete position could not be reached. The list is unchanged.',
      { phase: 'complete' },
    )
    return steps
  }

  auxiliary = deletingAuxiliary(target.label)
  state.metrics.visits += 1
  state.currentNodeId = target.id
  const successor = target.nextId ? nodesById.get(target.nextId) : undefined

  addStep(
    `singly-delete-select-${target.id}`,
    predecessor
      ? `Select ${target.label} at index ${deleteIndex}. ${predecessor.label}.next currently points here.`
      : `Select ${target.label} at HEAD. Next points to ${nodeLabel(successor)}.`,
    {
      phase: 'traverse',
      currentNodeId: target.id,
      deletingNodeId: target.id,
      visitedNodeIds: [...visited],
      highlightedNodeIds: [
        ...(predecessor ? [predecessor.id] : []),
        ...(successor ? [successor.id] : []),
      ],
    },
  )

  const relinkChanges: LinkedListPointerChange[] = []

  if (predecessor) {
    setLinkedListNext(predecessor, successor?.id)
    state.metrics.pointerUpdates += 1
    relinkChanges.push({
      pointer: 'next',
      fromNodeId: predecessor.id,
      toNodeId: successor?.id ?? null,
    })

    if (!successor) {
      const previousTailId = state.tailId ?? target.id
      state.tailId = predecessor.id
      state.metrics.pointerUpdates += 1
      relinkChanges.push({
        pointer: 'tail',
        fromNodeId: previousTailId,
        toNodeId: predecessor.id,
      })
    }

    const removedTail = relinkChanges.some((change) => change.pointer === 'tail')

    addStep(
      `singly-delete-relink-${predecessor.id}`,
      successor
        ? `Update ${predecessor.label}.next from ${target.label} to ${successor.label}, skipping ${target.label}.`
        : `Update ${predecessor.label}.next from ${target.label} to NULL${
            removedTail ? `, then point TAIL to ${predecessor.label}` : ''
          }.`,
      {
        phase: 'relink',
        currentNodeId: predecessor.id,
        deletingNodeId: target.id,
        highlightedNodeIds: [
          predecessor.id,
          ...(successor ? [successor.id] : []),
        ],
        pointerChanges: relinkChanges,
      },
      {
        title: `Update ${predecessor.label}.next`,
        lines: [
          `${predecessor.label}.next was ${target.label}`,
          `${predecessor.label}.next is now ${nodeLabel(successor)}`,
        ],
      },
    )
  } else {
    const previousHeadId = state.headId
    state.headId = successor?.id ?? null
    state.metrics.pointerUpdates += 1
    relinkChanges.push({
      pointer: 'head',
      fromNodeId: previousHeadId,
      toNodeId: state.headId,
    })

    if (!state.headId) {
      state.tailId = null
      state.metrics.pointerUpdates += 1
      relinkChanges.push({
        pointer: 'tail',
        fromNodeId: target.id,
        toNodeId: null,
      })
    }

    addStep(
      'singly-delete-relink-head',
      state.headId
        ? `Point HEAD from ${target.label} to ${nodeLabel(successor)}, skipping ${target.label}.`
        : `Point HEAD from ${target.label} to NULL. The list will be empty.`,
      {
        phase: 'relink',
        currentNodeId: successor?.id,
        deletingNodeId: target.id,
        highlightedNodeIds: successor ? [successor.id] : [],
        pointerChanges: relinkChanges,
      },
      {
        title: 'Update HEAD',
        lines: state.headId
          ? [
              `HEAD was ${target.label}`,
              `HEAD is now ${nodeLabel(successor)}`,
            ]
          : [
              `HEAD was ${target.label}`,
              'HEAD is now NULL',
              'TAIL is now NULL',
            ],
      },
    )
  }

  state.nodes = state.nodes.filter((node) => node.id !== target.id)

  addStep(
    'singly-delete-complete',
    `${target.label} has been removed. The list is now ${formatLinkedListChain(state)}.`,
    {
      phase: 'complete',
      currentNodeId: predecessor?.id ?? successor?.id,
      visitedNodeIds: [...visited],
    },
  )

  return steps
}
