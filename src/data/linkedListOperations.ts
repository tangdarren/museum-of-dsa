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
    id: 'singly-linked-list-traverse',
    title: 'Singly Linked List Traverse',
    variant: 'singly',
    shortDescription:
      'Walks from HEAD through each next pointer until NULL.',
    explore: ['HEAD pointer', 'Next links', 'End of the list'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: false,
  },
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
  {
    id: 'doubly-linked-list-traverse-forward',
    title: 'Doubly Linked List Forward Traverse',
    variant: 'doubly',
    shortDescription:
      'Walks from HEAD through each next pointer until NULL.',
    explore: ['HEAD pointer', 'Next links', 'End of the list'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: false,
  },
  {
    id: 'doubly-linked-list-traverse-backward',
    title: 'Doubly Linked List Backward Traverse',
    variant: 'doubly',
    shortDescription:
      'Walks from TAIL through each previous pointer until NULL.',
    explore: ['TAIL pointer', 'Previous links', 'Start of the list'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: false,
  },
  {
    id: 'doubly-linked-list-search',
    title: 'Doubly Linked List Search',
    variant: 'doubly',
    shortDescription:
      'Walks forward from HEAD until it finds a value or reaches the end.',
    explore: ['HEAD pointer', 'Next links', 'Found or missing values'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: false,
  },
  {
    id: 'doubly-linked-list-insert',
    title: 'Doubly Linked List Insert',
    variant: 'doubly',
    shortDescription:
      'Rewires next and previous pointers to place a new node in the list.',
    explore: ['Next updates', 'Previous updates', 'HEAD and TAIL'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: false,
  },
  {
    id: 'doubly-linked-list-delete',
    title: 'Doubly Linked List Delete',
    variant: 'doubly',
    shortDescription:
      'Unlinks a node by updating both neighboring next and previous pointers.',
    explore: ['Previous node', 'Next node', 'Removed node'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: false,
  },
]
