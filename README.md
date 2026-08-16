# Museum of DSA

A first-person digital museum for learning data structures and algorithms through curated exhibits.

Visitors enter a quiet gallery, walk into the Algorithms room, and study real graph algorithms on a central installation. Each algorithm is played back step by step, with the same visual language across traversal and pathfinding.

## Interactive algorithms

- Breadth First Search
- Depth First Search
- Dijkstra's Algorithm
- A* Search

Sorting and Data Structures exhibitions are planned. Quick Sort, Merge Sort, and the Data Structures wing are marked Coming Soon.

## Stack

React, TypeScript, React Three Fiber, Drei, Three.js, and Vite.

## Local setup

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

```bash
npm run build
npm run preview
```

## How to visit

1. Click **Enter** and walk into the lobby.
2. Choose **Algorithms**. Data Structures is Coming Soon.
3. Open **Choose Algorithm** and pick BFS, DFS, Dijkstra, or A*.
4. Select a start node. Pathfinding also asks for a target.
5. Use **Play**, **Next**, **Previous**, **Reset**, and speed controls to study the run.

Playback pauses at the end and keeps the final traversal or shortest path visible.
