import type { Exhibit } from '../types/exhibit'

export const EXHIBITS: Exhibit[] = [
  {
    id: 'bfs',
    title: 'Breadth First Search',
    category: 'Graph Theory',
    description: 'Visit a graph level by level, starting from a source node.',
    position: [-10.5, 0, -11.2],
    wing: 'graph-theory',
  },
  {
    id: 'dfs',
    title: 'Depth First Search',
    category: 'Graph Theory',
    description: 'Follow each path as far as it goes before backtracking.',
    position: [-3.5, 0, -11.2],
    wing: 'graph-theory',
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Algorithm",
    category: 'Graph Theory',
    description: 'Find the shortest path through a weighted graph.',
    position: [3.5, 0, -11.2],
    wing: 'graph-theory',
  },
  {
    id: 'a-star',
    title: 'A* Search',
    category: 'Graph Theory',
    description: 'Search for a path with the help of a heuristic guide.',
    position: [10.5, 0, -11.2],
    wing: 'graph-theory',
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    category: 'Algorithms',
    description: 'Sort values by partitioning around a chosen pivot.',
    position: [12.6, 0, -5.2],
    wing: 'algorithms',
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'Algorithms',
    description: 'Sort values by dividing, sorting, and merging them.',
    position: [12.6, 0, 3.2],
    wing: 'algorithms',
  },
  {
    id: 'binary-search-tree',
    title: 'Binary Search Tree',
    category: 'Data Structures',
    description: 'Store ordered values in a hierarchical tree.',
    position: [-12.6, 0, -1],
    wing: 'data-structures',
  },
]

export function getExhibitById(id: string): Exhibit | undefined {
  return EXHIBITS.find((exhibit) => exhibit.id === id)
}
