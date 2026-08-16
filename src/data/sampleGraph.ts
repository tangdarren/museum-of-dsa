import type { GraphData } from '../types/graph'

export const SAMPLE_GRAPH: GraphData = {
  nodes: [
    { id: 'A', label: 'A', position: [0, 0, 0.4] },
    { id: 'B', label: 'B', position: [-0.46, 0, 0.1] },
    { id: 'C', label: 'C', position: [0.46, 0, 0.1] },
    { id: 'D', label: 'D', position: [-0.56, 0, -0.28] },
    { id: 'E', label: 'E', position: [0, 0, -0.16] },
    { id: 'F', label: 'F', position: [0.56, 0, -0.28] },
    { id: 'G', label: 'G', position: [0, 0, -0.52] },
  ],
  edges: [
    { id: 'A-B', source: 'A', target: 'B', weight: 2 },
    { id: 'A-C', source: 'A', target: 'C', weight: 4 },
    { id: 'B-C', source: 'B', target: 'C', weight: 3 },
    { id: 'B-D', source: 'B', target: 'D', weight: 1 },
    { id: 'B-E', source: 'B', target: 'E', weight: 5 },
    { id: 'C-E', source: 'C', target: 'E', weight: 2 },
    { id: 'C-F', source: 'C', target: 'F', weight: 3 },
    { id: 'D-E', source: 'D', target: 'E', weight: 4 },
    { id: 'E-G', source: 'E', target: 'G', weight: 2 },
    { id: 'F-G', source: 'F', target: 'G', weight: 1 },
  ],
}
