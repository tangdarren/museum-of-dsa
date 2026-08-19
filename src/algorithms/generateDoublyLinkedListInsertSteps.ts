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
  formatLinkedListReverseChain,
  getLinkedListLength,
  getLinkedListTailId,
  indexLinkedListNodes,
  resolveLinkedListInsertIndex,
  setLinkedListNext,
  setLinkedListPrevious,
  type LinkedListSnapshotHighlights,
} from './linkedListShared'

function insertStartDescription(
  value: number,
  position: LinkedListMutationPosition,
  length: number,
): string {
  if (length === 0) {
    return `The list is empty. Insert ${value} as the first node, which becomes both HEAD and TAIL.`
  }

  if (position.at === 'head' || (position.at === 'index' && position.index === 0)) {
    return `Insert ${value} at HEAD. Update both next and previous pointers.`
  }

  if (
    position.at === 'tail' ||
    (position.at === 'index' && position.index === length)
  ) {
    return `Insert ${value} at TAIL using the TAIL pointer. Update both next and previous pointers.`
  }

  return `Insert ${value} at index ${position.index}. Walk from HEAD to the predecessor, then rewire both directions.`
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

function completeInspection(state: LinkedListData): AlgorithmInspection {
  return {
    title: 'List links',
    lines: [
      `Forward ${formatLinkedListChain(state)}`,
      `Backward ${formatLinkedListReverseChain(state)}`,
    ],
  }
}

export function generateDoublyLinkedListInsertSteps(
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
      'doubly-insert-start',
      invalidInsertDescription(position, length),
      { phase: 'start' },
    )
    addStep(
      'doubly-insert-complete',
      'The list is unchanged.',
      { phase: 'complete' },
    )
    return steps
  }

  addStep(
    'doubly-insert-start',
    insertStartDescription(value, position, length),
    {
      phase: 'start',
      currentNodeId: state.headId ?? undefined,
    },
  )

  let predecessor: LinkedListNode | undefined
  let successor: LinkedListNode | undefined

  if (insertIndex === 0) {
    successor = state.headId ? nodesById.get(state.headId) : undefined
  } else if (insertIndex === length) {
    const tailId = getLinkedListTailId(state)
    predecessor = tailId ? nodesById.get(tailId) : undefined
  } else {
    successor = state.headId ? nodesById.get(state.headId) : undefined
    const seen = new Set<string>()
    let index = 0

    while (successor && !seen.has(successor.id) && index < insertIndex) {
      const node: LinkedListNode = successor
      seen.add(node.id)
      state.metrics.visits += 1
      state.currentNodeId = node.id
      predecessor = node

      const next = node.nextId ? nodesById.get(node.nextId) : undefined

      addStep(
        `doubly-insert-visit-${node.id}`,
        index === insertIndex - 1
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
  }

  const newNodeId = createUniqueLinkedListNodeId(state.nodes, value)
  const newNode = createLinkedListNode(
    newNodeId,
    value,
    successor?.id,
    predecessor?.id,
  )
  state.nodes.push(newNode)
  nodesById.set(newNode.id, newNode)
  state.metrics.pointerUpdates += 2

  addStep(
    `doubly-insert-create-${newNode.id}`,
    `Create ${newNode.label}. Set ${newNode.label}.next → ${nodeLabel(successor)} and ${newNode.label}.previous → ${nodeLabel(predecessor)}.`,
    {
      phase: 'relink',
      currentNodeId: newNode.id,
      insertingNodeId: newNode.id,
      highlightedNodeIds: [
        ...(predecessor ? [predecessor.id] : []),
        ...(successor ? [successor.id] : []),
      ],
      pointerChanges: [
        {
          pointer: 'next',
          fromNodeId: newNode.id,
          toNodeId: successor?.id ?? null,
        },
        {
          pointer: 'previous',
          fromNodeId: newNode.id,
          toNodeId: predecessor?.id ?? null,
        },
      ],
    },
    {
      title: `Create ${newNode.label}`,
      lines: [
        `${newNode.label}.next → ${nodeLabel(successor)}`,
        `${newNode.label}.previous → ${nodeLabel(predecessor)}`,
      ],
    },
  )

  const relinkChanges: LinkedListPointerChange[] = []
  const relinkLines: string[] = []

  if (predecessor) {
    setLinkedListNext(predecessor, newNode.id)
    state.metrics.pointerUpdates += 1
    relinkChanges.push({
      pointer: 'next',
      fromNodeId: predecessor.id,
      toNodeId: newNode.id,
    })
    relinkLines.push(`${predecessor.label}.next → ${newNode.label}`)
  } else {
    const previousHeadId = state.headId
    state.headId = newNode.id
    state.metrics.pointerUpdates += 1
    relinkChanges.push({
      pointer: 'head',
      fromNodeId: previousHeadId,
      toNodeId: newNode.id,
    })
    relinkLines.push(`HEAD → ${newNode.label}`)
  }

  if (successor) {
    setLinkedListPrevious(successor, newNode.id)
    state.metrics.pointerUpdates += 1
    relinkChanges.push({
      pointer: 'previous',
      fromNodeId: successor.id,
      toNodeId: newNode.id,
    })
    relinkLines.push(`${successor.label}.previous → ${newNode.label}`)
  } else {
    const previousTailId = state.tailId ?? null
    state.tailId = newNode.id
    state.metrics.pointerUpdates += 1
    relinkChanges.push({
      pointer: 'tail',
      fromNodeId: previousTailId,
      toNodeId: newNode.id,
    })
    relinkLines.push(`TAIL → ${newNode.label}`)
  }

  addStep(
    `doubly-insert-relink-${newNode.id}`,
    relinkLines.join('. ') + '.',
    {
      phase: 'relink',
      currentNodeId: newNode.id,
      insertingNodeId: newNode.id,
      highlightedNodeIds: [
        ...(predecessor ? [predecessor.id] : []),
        ...(successor ? [successor.id] : []),
      ],
      pointerChanges: relinkChanges,
    },
    {
      title: 'Update neighbors',
      lines: relinkLines,
    },
  )

  addStep(
    'doubly-insert-complete',
    `Inserted ${newNode.label}. The list is now ${formatLinkedListChain(state)}.`,
    {
      phase: 'complete',
      currentNodeId: newNode.id,
      insertingNodeId: newNode.id,
    },
    completeInspection(state),
  )

  return steps
}
