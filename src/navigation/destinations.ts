import type { AlgorithmId } from '../types/algorithm'

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

export const CAMERA_FOV = 46

// The installation plate is nearly as wide as its hall, and the focus camera sits
// close to it, so the framing only holds on a wide viewport. Below this aspect the
// vertical fov is widened to keep the horizontal field (and the whole plate) intact.
export const MIN_FRAMED_ASPECT = 1.78
export const MAX_CAMERA_FOV = 70

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

export function getMuseumDestination(
  location: MuseumLocation,
  selectedAlgorithm: AlgorithmId | null = null,
): MuseumDestination {
  if (location === 'algorithms' && selectedAlgorithm) {
    return ALGORITHM_FOCUS_DESTINATION
  }

  if (location === 'data-structures' && selectedAlgorithm) {
    return DATA_STRUCTURE_FOCUS_DESTINATION
  }

  return MUSEUM_DESTINATIONS[location]
}
