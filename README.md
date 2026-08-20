# Museum of DSA

A small 3D museum for data structures and algorithms. Walk in, pick a room, and play an exhibit step by step.

## What's open

**Algorithms** — BFS, DFS, Dijkstra, A*, the usual sorts (bubble, insertion, quick, merge), plus tree traversals and BST search.

**Data Structures** — singly and doubly linked lists: traverse, search, insert, delete. Hash tables: insert, search, delete with separate chaining.

BST Insert isn't in yet.

## Stack

React, TypeScript, React Three Fiber, Drei, Three.js, Vite.

## Setup

```bash
npm install
npm run dev
```

Open the URL Vite prints. `npm run build` / `npm run preview` if you want a production build.

## Visiting

Click **Enter**, then go through **Algorithms** or **Data Structures**. Pick something from a wall or the chooser, then use Play / Next / Previous / Reset like a normal playback. Graphs ask for a start node (and a target for pathfinding). Hash tables take a key (and a value for insert) and start from a seeded table that already has collisions in it.
