import { Canvas } from '@react-three/fiber'
import { useCallback, useState } from 'react'
import EnterMuseumButton from './components/museum/EnterMuseumButton'
import ExhibitOverlay from './components/museum/ExhibitOverlay'
import { getExhibitById } from './data/exhibits'
import MuseumCameraController from './navigation/MuseumCameraController'
import {
  MUSEUM_DESTINATIONS,
  getMuseumDestination,
  type MuseumLocation,
} from './navigation/destinations'
import MuseumScene from './scenes/MuseumScene'

function App() {
  const [location, setLocation] = useState<MuseumLocation>('entrance')
  const [activeExhibitId, setActiveExhibitId] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [enterButton, setEnterButton] = useState<'active' | 'fading' | 'gone'>(
    'active',
  )

  const activeExhibit = activeExhibitId
    ? getExhibitById(activeExhibitId)
    : undefined
  const destination = getMuseumDestination(location, activeExhibitId)

  const goToLocation = useCallback(
    (next: MuseumLocation) => {
      if (isTransitioning) {
        return
      }

      if (!activeExhibitId && next === location) {
        return
      }

      setActiveExhibitId(null)
      setLocation(next)
      setIsTransitioning(true)
    },
    [activeExhibitId, isTransitioning, location],
  )

  const goToExhibit = useCallback(
    (id: string) => {
      if (isTransitioning || id === activeExhibitId) {
        return
      }

      const exhibit = getExhibitById(id)

      if (!exhibit || exhibit.wing === 'data-structures') {
        return
      }

      setActiveExhibitId(id)
      setLocation('exhibit')
      setIsTransitioning(true)
    },
    [activeExhibitId, isTransitioning],
  )

  const handleEnterMuseum = useCallback(() => {
    if (enterButton !== 'active' || isTransitioning) {
      return
    }

    setEnterButton('fading')
    setLocation('lobby')
    setIsTransitioning(true)
  }, [enterButton, isTransitioning])

  const handleArrived = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  return (
    <div className="app">
      <Canvas
        shadows
        camera={{
          position: MUSEUM_DESTINATIONS.entrance.cameraPosition,
          fov: 46,
        }}
      >
        <MuseumCameraController
          destination={destination}
          onArrived={handleArrived}
        />
        <MuseumScene
          location={location}
          onSelectAlgorithms={() => goToLocation('algorithms')}
          onSelectExhibit={goToExhibit}
          isTransitioning={isTransitioning}
        />
      </Canvas>
      {enterButton !== 'gone' ? (
        <EnterMuseumButton
          disabled={enterButton !== 'active'}
          fading={enterButton === 'fading'}
          onEnter={handleEnterMuseum}
          onFaded={() => setEnterButton('gone')}
        />
      ) : null}
      {location === 'algorithms' && !activeExhibit ? (
        <button
          type="button"
          className="museum-button lobby-button"
          onClick={() => goToLocation('lobby')}
          disabled={isTransitioning}
        >
          ← Lobby
        </button>
      ) : null}
      {activeExhibit ? (
        <ExhibitOverlay
          exhibit={activeExhibit}
          onBackToWing={() => goToLocation('algorithms')}
          disabled={isTransitioning}
        />
      ) : null}
    </div>
  )
}

export default App
