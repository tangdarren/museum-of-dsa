# Museum of DSA

A first-person digital museum for learning data structures and algorithms through curated exhibits.

Visitors enter a quiet gallery, then choose a wing. Algorithms shows how computers solve problems step by step. Data Structures shows how values are stored and rewritten in memory. Each exhibit uses the same playback language: Play, Pause, Next, Previous, Reset, and speed.

## Interactive exhibits

### Algorithms

Graph traversal and pathfinding:

- Breadth First Search
- Depth First Search
- Dijkstra's Algorithm
- A* Search

Sorting:

- Bubble Sort
- Insertion Sort
- Quick Sort
- Merge Sort

Trees:

- Preorder Traversal
- Inorder Traversal
- Postorder Traversal
- Binary Search Tree Search

BST Insert is marked Coming Soon.

### Data Structures

Linked lists, with a switch between singly and doubly linked lists:

- Traverse, Search, Insert, and Delete on a singly linked list
- Traverse Forward, Traverse Backward, Search, Insert, and Delete on a doubly linked list

The installation labels HEAD, TAIL, next, previous, and NULL so the chain is readable on a first visit. Search, insert, and delete offer small constrained inputs. Access and search are O(n). Insert or delete at HEAD is O(1); a doubly linked list can also do that at TAIL in O(1). Operations that first walk the list are O(n).

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
2. Choose **Algorithms** or **Data Structures**.
3. In Algorithms, open **Choose Algorithm** or select a gallery wall. Graph algorithms ask for a start node; pathfinding also asks for a target.
4. In Data Structures, open **Choose Operation** or select Singly Linked List or Doubly Linked List, then pick an operation.
5. Use **Play**, **Next**, **Previous**, **Reset**, and speed controls to study the run.

Playback pauses at the end and keeps the final state visible.
