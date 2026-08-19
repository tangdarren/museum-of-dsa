import type { LinkedListData } from '../types/linkedList'

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
