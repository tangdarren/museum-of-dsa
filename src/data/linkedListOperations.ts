import type { AlgorithmComplexity } from '../types/algorithm'
import type {
  LinkedListVariant,
  LinkedListOperationId,
} from '../types/linkedList'

export type LinkedListOperationDefinition = {
  id: LinkedListOperationId
  title: string
  variant: LinkedListVariant
  shortDescription: string
  explore: [string, string, string]
  complexity: AlgorithmComplexity
  available: false
}

export const LINKED_LIST_OPERATIONS: LinkedListOperationDefinition[] = [
  {
    id: 'singly-linked-list-search',
    title: 'Singly Linked List Search',
    variant: 'singly',
    shortDescription:
      'Walks from the head until it finds a value or reaches the end.',
    explore: ['Head pointer', 'Next links', 'Found or missing values'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: false,
  },
  {
    id: 'singly-linked-list-insert',
    title: 'Singly Linked List Insert',
    variant: 'singly',
    shortDescription: 'Rewires next pointers to place a new node in the list.',
    explore: ['Head and tail', 'Next pointer updates', 'Inserted node'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: false,
  },
  {
    id: 'singly-linked-list-delete',
    title: 'Singly Linked List Delete',
    variant: 'singly',
    shortDescription: "Unlinks a node by updating the previous node's next pointer.",
    explore: ['Previous node', 'Next pointer updates', 'Removed node'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: false,
  },
]
