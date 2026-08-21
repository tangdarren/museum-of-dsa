import type {
  AlgorithmCategory,
  AlgorithmId,
  AlgorithmRoomCategory,
  DataStructureCategory,
} from '../types/algorithm'
import {
  isAlgorithmRoomCategory,
  isDataStructureCategory,
} from '../types/algorithm'

export type Vec3 = [number, number, number]

export type MuseumLocation = 'entrance' | 'lobby' | 'data-structures' | 'algorithms'

export type MuseumDestination = {
  id: string
  cameraPosition: Vec3
  lookAt: Vec3
}

export const ROOM_WIDTH = 32
export const ROOM_DEPTH = 28
export const ROOM_HEIGHT = 9
export const WALL_THICKNESS = 0.3

export const ENTRANCE_PORTAL = {
  width: 4.6,
  height: 3.7,
  y: 2.05,
}

export const LOBBY_DEPTH = 18
export const LOBBY_DOOR_OFFSET = 5.6
export const LOBBY_DOOR = {
  width: 4.2,
  height: 3.7,
  y: 2.05,
}

export const ALGORITHMS_ROOM_WIDTH = 14
export const ALGORITHMS_ROOM_DEPTH = 14

export const FRONT_BACK = -ROOM_DEPTH / 2
export const LOBBY_CENTER_Z = FRONT_BACK - LOBBY_DEPTH / 2
export const LOBBY_BACK = FRONT_BACK - LOBBY_DEPTH
// Each hall is ALGORITHMS_ROOM_WIDTH wide, so the centers have to sit at least a
// half width plus a wall apart. Any closer and one hall's side wall stands inside
// the other, clipping its installation and hiding its wall panels.
export const EXHIBIT_HALL_GAP = WALL_THICKNESS
export const EXHIBIT_HALL_CENTER_OFFSET =
  ALGORITHMS_ROOM_WIDTH / 2 + WALL_THICKNESS + EXHIBIT_HALL_GAP / 2
export const ALGORITHMS_CENTER_X = EXHIBIT_HALL_CENTER_OFFSET
export const DATA_STRUCTURES_CENTER_X = -EXHIBIT_HALL_CENTER_OFFSET
export const ALGORITHMS_CENTER_Z = LOBBY_BACK - ALGORITHMS_ROOM_DEPTH / 2
export const ALGORITHMS_BACK = LOBBY_BACK - ALGORITHMS_ROOM_DEPTH

export const ALGORITHM_INSTALLATION_POSITION: Vec3 = [
  ALGORITHMS_CENTER_X,
  0,
  ALGORITHMS_BACK + 1.15,
]

export const ALGORITHM_INSTALLATION_LOOK_AT: Vec3 = [
  ALGORITHMS_CENTER_X,
  3.15,
  ALGORITHMS_BACK + 1.15,
]

export const DATA_STRUCTURE_INSTALLATION_POSITION: Vec3 = [
  DATA_STRUCTURES_CENTER_X,
  0,
  ALGORITHMS_BACK + 1.15,
]

export const DATA_STRUCTURE_INSTALLATION_LOOK_AT: Vec3 = [
  DATA_STRUCTURES_CENTER_X,
  3.15,
  ALGORITHMS_BACK + 1.15,
]

export const MUSEUM_DESTINATIONS: Record<MuseumLocation, MuseumDestination> = {
  entrance: {
    id: 'entrance',
    cameraPosition: [0, 3.35, 12.2],
    lookAt: [0, 3.4, -6],
  },
  lobby: {
    id: 'lobby',
    cameraPosition: [0, 3.35, FRONT_BACK - 6],
    lookAt: [0, 2.7, LOBBY_BACK],
  },
  'data-structures': {
    id: 'data-structures',
    cameraPosition: [DATA_STRUCTURES_CENTER_X, 3.15, LOBBY_BACK - 2.2],
    lookAt: DATA_STRUCTURE_INSTALLATION_LOOK_AT,
  },
  algorithms: {
    id: 'algorithms',
    cameraPosition: [ALGORITHMS_CENTER_X, 3.15, LOBBY_BACK - 2.2],
    lookAt: ALGORITHM_INSTALLATION_LOOK_AT,
  },
}

export const ALGORITHM_FOCUS_DESTINATION: MuseumDestination = {
  id: 'algorithm-focus',
  cameraPosition: [ALGORITHMS_CENTER_X, 3.1, LOBBY_BACK - 4.0],
  lookAt: ALGORITHM_INSTALLATION_LOOK_AT,
}

export const DATA_STRUCTURE_FOCUS_DESTINATION: MuseumDestination = {
  id: 'data-structure-focus',
  cameraPosition: [DATA_STRUCTURES_CENTER_X, 3.1, LOBBY_BACK - 4.0],
  lookAt: DATA_STRUCTURE_INSTALLATION_LOOK_AT,
}

const ALGORITHMS_LEFT_WALL_X =
  ALGORITHMS_CENTER_X - ALGORITHMS_ROOM_WIDTH / 2 + 0.2
const ALGORITHMS_RIGHT_WALL_X =
  ALGORITHMS_CENTER_X + ALGORITHMS_ROOM_WIDTH / 2 - 0.2
const DATA_STRUCTURES_LEFT_WALL_X =
  DATA_STRUCTURES_CENTER_X - ALGORITHMS_ROOM_WIDTH / 2 + 0.2
const DATA_STRUCTURES_RIGHT_WALL_X =
  DATA_STRUCTURES_CENTER_X + ALGORITHMS_ROOM_WIDTH / 2 - 0.2
const GALLERY_FRONT_Z = ALGORITHMS_CENTER_Z + 2.55
const GALLERY_BACK_Z = ALGORITHMS_CENTER_Z - 2.15
const GALLERY_VIEW_DISTANCE = 4.55
const GALLERY_PANEL_Y = 3.28

export type AlgorithmGallerySide = 'left' | 'right'

export type AlgorithmGalleryPlacement = {
  side: AlgorithmGallerySide
  position: Vec3
  rotation: Vec3
}

export const ALGORITHM_GALLERY_PLACEMENTS: Record<
  AlgorithmRoomCategory,
  AlgorithmGalleryPlacement
> = {
  'Graph Traversal': {
    side: 'left',
    position: [ALGORITHMS_LEFT_WALL_X, GALLERY_PANEL_Y, GALLERY_FRONT_Z],
    rotation: [0, Math.PI / 2, 0],
  },
  Pathfinding: {
    side: 'left',
    position: [ALGORITHMS_LEFT_WALL_X, GALLERY_PANEL_Y, GALLERY_BACK_Z],
    rotation: [0, Math.PI / 2, 0],
  },
  Sorting: {
    side: 'right',
    position: [ALGORITHMS_RIGHT_WALL_X, GALLERY_PANEL_Y, GALLERY_FRONT_Z],
    rotation: [0, -Math.PI / 2, 0],
  },
  Trees: {
    side: 'right',
    position: [ALGORITHMS_RIGHT_WALL_X, GALLERY_PANEL_Y, GALLERY_BACK_Z],
    rotation: [0, -Math.PI / 2, 0],
  },
}

function galleryCameraX(side: AlgorithmGallerySide, centerX: number) {
  const leftX = centerX - ALGORITHMS_ROOM_WIDTH / 2 + 0.2
  const rightX = centerX + ALGORITHMS_ROOM_WIDTH / 2 - 0.2

  return side === 'left'
    ? leftX + GALLERY_VIEW_DISTANCE
    : rightX - GALLERY_VIEW_DISTANCE
}

export const ALGORITHM_GALLERY_DESTINATIONS: Record<
  AlgorithmRoomCategory,
  MuseumDestination
> = {
  'Graph Traversal': {
    id: 'gallery-graph-traversal',
    cameraPosition: [
      galleryCameraX('left', ALGORITHMS_CENTER_X),
      3.22,
      GALLERY_FRONT_Z,
    ],
    lookAt: [ALGORITHMS_LEFT_WALL_X, GALLERY_PANEL_Y, GALLERY_FRONT_Z],
  },
  Pathfinding: {
    id: 'gallery-pathfinding',
    cameraPosition: [
      galleryCameraX('left', ALGORITHMS_CENTER_X),
      3.22,
      GALLERY_BACK_Z,
    ],
    lookAt: [ALGORITHMS_LEFT_WALL_X, GALLERY_PANEL_Y, GALLERY_BACK_Z],
  },
  Sorting: {
    id: 'gallery-sorting',
    cameraPosition: [
      galleryCameraX('right', ALGORITHMS_CENTER_X),
      3.22,
      GALLERY_FRONT_Z,
    ],
    lookAt: [ALGORITHMS_RIGHT_WALL_X, GALLERY_PANEL_Y, GALLERY_FRONT_Z],
  },
  Trees: {
    id: 'gallery-trees',
    cameraPosition: [
      galleryCameraX('right', ALGORITHMS_CENTER_X),
      3.22,
      GALLERY_BACK_Z,
    ],
    lookAt: [ALGORITHMS_RIGHT_WALL_X, GALLERY_PANEL_Y, GALLERY_BACK_Z],
  },
}

export const DATA_STRUCTURE_GALLERY_PLACEMENTS: Record<
  DataStructureCategory,
  AlgorithmGalleryPlacement
> = {
  'Singly Linked List': {
    side: 'left',
    position: [DATA_STRUCTURES_LEFT_WALL_X, GALLERY_PANEL_Y, GALLERY_FRONT_Z],
    rotation: [0, Math.PI / 2, 0],
  },
  'Doubly Linked List': {
    side: 'right',
    position: [DATA_STRUCTURES_RIGHT_WALL_X, GALLERY_PANEL_Y, GALLERY_FRONT_Z],
    rotation: [0, -Math.PI / 2, 0],
  },
  'Hash Table': {
    side: 'left',
    position: [DATA_STRUCTURES_LEFT_WALL_X, GALLERY_PANEL_Y, GALLERY_BACK_Z],
    rotation: [0, Math.PI / 2, 0],
  },
}

export const DATA_STRUCTURE_GALLERY_DESTINATIONS: Record<
  DataStructureCategory,
  MuseumDestination
> = {
  'Singly Linked List': {
    id: 'gallery-singly-linked-list',
    cameraPosition: [
      galleryCameraX('left', DATA_STRUCTURES_CENTER_X),
      3.22,
      GALLERY_FRONT_Z,
    ],
    lookAt: [DATA_STRUCTURES_LEFT_WALL_X, GALLERY_PANEL_Y, GALLERY_FRONT_Z],
  },
  'Doubly Linked List': {
    id: 'gallery-doubly-linked-list',
    cameraPosition: [
      galleryCameraX('right', DATA_STRUCTURES_CENTER_X),
      3.22,
      GALLERY_FRONT_Z,
    ],
    lookAt: [DATA_STRUCTURES_RIGHT_WALL_X, GALLERY_PANEL_Y, GALLERY_FRONT_Z],
  },
  'Hash Table': {
    id: 'gallery-hash-table',
    cameraPosition: [
      galleryCameraX('left', DATA_STRUCTURES_CENTER_X),
      3.22,
      GALLERY_BACK_Z,
    ],
    lookAt: [DATA_STRUCTURES_LEFT_WALL_X, GALLERY_PANEL_Y, GALLERY_BACK_Z],
  },
}

export function getMuseumDestination(
  location: MuseumLocation,
  selectedAlgorithm: AlgorithmId | null = null,
  selectedGallery: AlgorithmCategory | null = null,
): MuseumDestination {
  if (location === 'algorithms' && selectedAlgorithm) {
    return ALGORITHM_FOCUS_DESTINATION
  }

  if (
    location === 'algorithms' &&
    selectedGallery &&
    isAlgorithmRoomCategory(selectedGallery)
  ) {
    return ALGORITHM_GALLERY_DESTINATIONS[selectedGallery]
  }

  if (location === 'data-structures' && selectedAlgorithm) {
    return DATA_STRUCTURE_FOCUS_DESTINATION
  }

  if (
    location === 'data-structures' &&
    selectedGallery &&
    isDataStructureCategory(selectedGallery)
  ) {
    return DATA_STRUCTURE_GALLERY_DESTINATIONS[selectedGallery]
  }

  return MUSEUM_DESTINATIONS[location]
}
