import { EXHIBITS } from '../data/exhibits'
import type { Exhibit } from '../types/exhibit'

export type Vec3 = [number, number, number]

export type MuseumLocation =
  | 'entrance'
  | 'lobby'
  | 'data-structures'
  | 'algorithms'
  | 'exhibit'

export type ExhibitWingId = 'data-structures' | 'algorithms' | 'graph-theory'

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
export const ALGORITHMS_CENTER_X = LOBBY_DOOR_OFFSET
export const ALGORITHMS_CENTER_Z = LOBBY_BACK - ALGORITHMS_ROOM_DEPTH / 2
export const ALGORITHMS_BACK = LOBBY_BACK - ALGORITHMS_ROOM_DEPTH

export const MUSEUM_DESTINATIONS: Record<
  Exclude<MuseumLocation, 'exhibit'>,
  MuseumDestination
> = {
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
    cameraPosition: [-LOBBY_DOOR_OFFSET, 3.25, LOBBY_BACK + 6.2],
    lookAt: [-LOBBY_DOOR_OFFSET, 2.6, LOBBY_BACK],
  },
  algorithms: {
    id: 'algorithms',
    cameraPosition: [ALGORITHMS_CENTER_X, 3.25, LOBBY_BACK - 4.8],
    lookAt: [ALGORITHMS_CENTER_X, 2.6, ALGORITHMS_BACK],
  },
}

function createExhibitDestination(exhibit: Exhibit): MuseumDestination {
  const [x, y, z] = exhibit.position

  switch (exhibit.wing) {
    case 'graph-theory':
      return exhibit.id === 'bfs'
        ? {
            id: exhibit.id,
            cameraPosition: [x, y + 2.55, z + 4.1],
            lookAt: [x, y + 1.28, z],
          }
        : {
            id: exhibit.id,
            cameraPosition: [x, y + 2.35, z + 3.5],
            lookAt: [x, y + 1.55, z],
          }
    case 'data-structures':
      return {
        id: exhibit.id,
        cameraPosition: [x + 3.5, y + 2.35, z],
        lookAt: [x, y + 1.55, z],
      }
    case 'algorithms':
      return {
        id: exhibit.id,
        cameraPosition: [x - 3.5, y + 2.35, z],
        lookAt: [x, y + 1.55, z],
      }
  }
}

export const EXHIBIT_DESTINATIONS: Record<string, MuseumDestination> =
  Object.fromEntries(
    EXHIBITS.map((exhibit) => [exhibit.id, createExhibitDestination(exhibit)]),
  )

export function getMuseumDestination(
  location: MuseumLocation,
  exhibitId: string | null,
): MuseumDestination {
  if (location === 'exhibit' && exhibitId) {
    return EXHIBIT_DESTINATIONS[exhibitId] ?? MUSEUM_DESTINATIONS.algorithms
  }

  if (location === 'exhibit') {
    return MUSEUM_DESTINATIONS.algorithms
  }

  return MUSEUM_DESTINATIONS[location]
}
