import type { AlgorithmDefinition } from '../types/algorithm'

export const LINKED_LIST_OPERATIONS: AlgorithmDefinition[] = [
  {
    id: 'singly-linked-list-traverse',
    title: 'Traverse',
    category: 'Singly Linked List',
    shortDescription:
      'Walks from HEAD through each next pointer until NULL.',
    explore: ['HEAD pointer', 'Next links', 'End of the list'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'singly-linked-list-search',
    title: 'Search',
    category: 'Singly Linked List',
    shortDescription:
      'Walks from HEAD until it finds a value or reaches NULL.',
    explore: ['HEAD pointer', 'Next links', 'Found or missing values'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'singly-linked-list-insert',
    title: 'Insert',
    category: 'Singly Linked List',
    shortDescription: 'Rewires next pointers to place a new node in the list.',
    explore: [
      'HEAD insert is O(1)',
      'Middle or tail insert is O(n)',
      'Next pointer updates',
    ],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'singly-linked-list-delete',
    title: 'Delete',
    category: 'Singly Linked List',
    shortDescription:
      "Unlinks a node by updating the previous node's next pointer.",
    explore: [
      'HEAD delete is O(1)',
      'Other deletes are O(n)',
      'Next pointer updates',
    ],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'doubly-linked-list-traverse-forward',
    title: 'Traverse Forward',
    category: 'Doubly Linked List',
    shortDescription:
      'Walks from HEAD through each next pointer until NULL.',
    explore: ['HEAD pointer', 'Next links', 'End of the list'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'doubly-linked-list-traverse-backward',
    title: 'Traverse Backward',
    category: 'Doubly Linked List',
    shortDescription:
      'Walks from TAIL through each previous pointer until NULL.',
    explore: ['TAIL pointer', 'Previous links', 'Start of the list'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'doubly-linked-list-search',
    title: 'Search',
    category: 'Doubly Linked List',
    shortDescription:
      'Walks forward from HEAD until it finds a value or reaches NULL.',
    explore: ['HEAD pointer', 'Next links', 'Found or missing values'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'doubly-linked-list-insert',
    title: 'Insert',
    category: 'Doubly Linked List',
    shortDescription:
      'Rewires next and previous pointers to place a new node in the list.',
    explore: [
      'HEAD or TAIL insert is O(1)',
      'Middle insert is O(n)',
      'Next and previous updates',
    ],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'doubly-linked-list-delete',
    title: 'Delete',
    category: 'Doubly Linked List',
    shortDescription:
      'Unlinks a node by updating both neighboring next and previous pointers.',
    explore: [
      'HEAD or TAIL delete is O(1)',
      'Middle delete is O(n)',
      'Next and previous updates',
    ],
    complexity: { time: 'O(n)', space: 'O(1)' },
    available: true,
  },
]

export function getLinkedListExhibitPrimer(category: string): string | undefined {
  if (category === 'Singly Linked List') {
    return 'Each node stores a value and a next pointer. HEAD is the first node. The last next pointer is NULL, so you cannot walk backward.'
  }

  if (category === 'Doubly Linked List') {
    return 'Each node stores next and previous pointers. HEAD is the first node and TAIL is the last. NULL sits beyond both ends, so you can walk either direction.'
  }
}
