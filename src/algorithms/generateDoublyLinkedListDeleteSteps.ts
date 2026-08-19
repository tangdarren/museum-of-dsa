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
  formatLinkedListReverseChain,
  getLinkedListLength,
  getLinkedListTailId,
  indexLinkedListNodes,
  resolveLinkedListDeleteIndex,
  setLinkedListNext,
  setLinkedListPrevious,
  type LinkedListSnapshotHighlights,
} from './linkedListShared'

function deleteStartDescription(
  position: LinkedListMutationPosition,
  length: number,
): string {
  if (position.at === 'head' || (position.at === 'index' && position.index === 0)) {
    return 'Delete the HEAD node. The former next node must clear its previous pointer.'
  }

  if (
    position.at === 'tail' ||
    (position.at === 'index' && position.index === length - 1)
  ) {
    return 'Delete the TAIL node using previous. The former previous node must clear its next pointer.'
  }

  return `Delete the node at index ${position.index}. Rewire both neighboring next and previous pointers.`
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

function completeInspection(state: LinkedListData): AlgorithmInspection {
  return {
    title: 'List links',
    lines: [
      `Forward ${formatLinkedListChain(state)}`,
      `Backward ${formatLinkedListReverseChain(state)}`,
    ],
  }
}

export function generateDoublyLinkedListDeleteSteps(
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
      'doubly-delete-start',
      invalidDeleteDescription(position, length),
      { phase: 'start' },
    )
    addStep(
      'doubly-delete-complete',
      'The list is unchanged.',
      { phase: 'complete' },
    )
    return steps
  }

  addStep(
    'doubly-delete-start',
    deleteStartDescription(position, length),
    {
      phase: 'start',
      currentNodeId:
        deleteIndex === length - 1
          ? (getLinkedListTailId(state) ?? undefined)
          : (state.headId ?? undefined),
    },
  )

  let target: LinkedListNode | undefined
  const visited: string[] = []

  if (deleteIndex === length - 1) {
    const tailId = getLinkedListTailId(state)
    target = tailId ? nodesById.get(tailId) : undefined
  } else {
    target = state.headId ? nodesById.get(state.headId) : undefined
    const seen = new Set<string>()
    let index = 0

    while (target && !seen.has(target.id) && index < deleteIndex) {
      const node: LinkedListNode = target
      seen.add(node.id)
      visited.push(node.id)
      state.metrics.visits += 1
      state.currentNodeId = node.id

      const next = node.nextId ? nodesById.get(node.nextId) : undefined

      addStep(
        `doubly-delete-visit-${node.id}`,
        `Visit ${node.label} at index ${index}. Follow next to ${nodeLabel(next)}.`,
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
  }

  if (!target) {
    addStep(
      'doubly-delete-complete',
      'The delete position could not be reached. The list is unchanged.',
      { phase: 'complete' },
    )
    return steps
  }

  auxiliary = deletingAuxiliary(target.label)
  state.metrics.visits += 1
  state.currentNodeId = target.id
  const predecessor = target.previousId
    ? nodesById.get(target.previousId)
    : undefined
  const successor = target.nextId ? nodesById.get(target.nextId) : undefined

  addStep(
    `doubly-delete-select-${target.id}`,
    `Select ${target.label}. ${target.label}.previous → ${nodeLabel(predecessor)} and ${target.label}.next → ${nodeLabel(successor)}.`,
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
    {
      title: `Unlink ${target.label}`,
      lines: [
        `${target.label}.previous → ${nodeLabel(predecessor)}`,
        `${target.label}.next → ${nodeLabel(successor)}`,
      ],
    },
  )

  const relinkChanges: LinkedListPointerChange[] = []
  const relinkLines: string[] = []

  if (predecessor) {
    setLinkedListNext(predecessor, successor?.id)
    state.metrics.pointerUpdates += 1
    relinkChanges.push({
      pointer: 'next',
      fromNodeId: predecessor.id,
      toNodeId: successor?.id ?? null,
    })
    relinkLines.push(
      `${predecessor.label}.next → ${nodeLabel(successor)}`,
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
    relinkLines.push(`HEAD → ${nodeLabel(successor)}`)
  }

  if (successor) {
    setLinkedListPrevious(successor, predecessor?.id)
    state.metrics.pointerUpdates += 1
    relinkChanges.push({
      pointer: 'previous',
      fromNodeId: successor.id,
      toNodeId: predecessor?.id ?? null,
    })
    relinkLines.push(
      `${successor.label}.previous → ${nodeLabel(predecessor)}`,
    )
  } else {
    const previousTailId = state.tailId ?? target.id
    state.tailId = predecessor?.id ?? null
    state.metrics.pointerUpdates += 1
    relinkChanges.push({
      pointer: 'tail',
      fromNodeId: previousTailId,
      toNodeId: state.tailId,
    })
    relinkLines.push(`TAIL → ${nodeLabel(predecessor)}`)
  }

  addStep(
    `doubly-delete-relink-${target.id}`,
    relinkLines.join('. ') + '.',
    {
      phase: 'relink',
      currentNodeId: predecessor?.id ?? successor?.id,
      deletingNodeId: target.id,
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

  state.nodes = state.nodes.filter((node) => node.id !== target.id)

  addStep(
    'doubly-delete-complete',
    `${target.label} has been removed. The list is now ${formatLinkedListChain(state)}.`,
    {
      phase: 'complete',
      currentNodeId: predecessor?.id ?? successor?.id,
      visitedNodeIds: [...visited],
    },
    completeInspection(state),
  )

  return steps
}
