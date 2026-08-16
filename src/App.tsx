import { Canvas } from '@react-three/fiber'
import { useCallback, useState } from 'react'
import AlgorithmPlaybackView from './components/algorithms/AlgorithmPlaybackView'
import AlgorithmInstallationUi from './components/museum/AlgorithmInstallationUi'
import AlgorithmPlaque from './components/museum/AlgorithmPlaque'
import EnterMuseumButton from './components/museum/EnterMuseumButton'
import { getAlgorithmById } from './data/algorithms'
import { DEMO_ALGORITHM_STEPS } from './data/demoAlgorithmSteps'
import { useAlgorithmPlayback } from './hooks/useAlgorithmPlayback'
import MuseumCameraController from './navigation/MuseumCameraController'
import {
  MUSEUM_DESTINATIONS,
  getMuseumDestination,
  type MuseumLocation,
} from './navigation/destinations'
import MuseumScene from './scenes/MuseumScene'
import type { AlgorithmId } from './types/algorithm'

function App() {
  const [location, setLocation] = useState<MuseumLocation>('entrance')
  const [selectedAlgorithmId, setSelectedAlgorithmId] =
    useState<AlgorithmId | null>(null)
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [previewAlgorithmId, setPreviewAlgorithmId] =
    useState<AlgorithmId | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [enterButton, setEnterButton] = useState<'active' | 'fading' | 'gone'>(
    'active',
  )

  const selectedAlgorithm = selectedAlgorithmId
    ? getAlgorithmById(selectedAlgorithmId)
    : null
  const previewAlgorithm = previewAlgorithmId
    ? getAlgorithmById(previewAlgorithmId)
    : null
  const destination = getMuseumDestination(location, selectedAlgorithmId)
  const playback = useAlgorithmPlayback(
    selectedAlgorithmId ? DEMO_ALGORITHM_STEPS : [],
    selectedAlgorithmId,
  )

  const goToLocation = useCallback(
    (next: MuseumLocation) => {
      if (isTransitioning) {
        return
      }

      if (next === location && !selectedAlgorithmId) {
        return
      }

      setSelectedAlgorithmId(null)
      setPreviewAlgorithmId(null)
      setSelectorOpen(false)
      setLocation(next)
      setIsTransitioning(true)
    },
    [isTransitioning, location, selectedAlgorithmId],
  )

  const handleEnterMuseum = useCallback(() => {
    if (enterButton !== 'active' || isTransitioning) {
      return
    }

    setEnterButton('fading')
    setLocation('lobby')
    setIsTransitioning(true)
  }, [enterButton, isTransitioning])

  const handleSelectAlgorithm = useCallback(
    (id: AlgorithmId) => {
      if (isTransitioning) {
        return
      }

      setSelectorOpen(false)
      setPreviewAlgorithmId(null)
      setSelectedAlgorithmId(id)
      setIsTransitioning(true)
    },
    [isTransitioning],
  )

  const handleBackToAlgorithms = useCallback(() => {
    if (isTransitioning) {
      return
    }

    setSelectedAlgorithmId(null)
    setPreviewAlgorithmId(null)
    setSelectorOpen(false)
    setIsTransitioning(true)
  }, [isTransitioning])

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
          selectedAlgorithm={selectedAlgorithm}
          previewAlgorithm={previewAlgorithm}
          playbackStep={selectedAlgorithm ? playback.currentStep : null}
          onSelectAlgorithms={() => goToLocation('algorithms')}
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
      {location === 'algorithms' && !selectedAlgorithmId ? (
        <>
          <button
            type="button"
            className="museum-button lobby-button"
            onClick={() => goToLocation('lobby')}
            disabled={isTransitioning}
          >
            ← Lobby
          </button>
          <AlgorithmInstallationUi
            selectorOpen={selectorOpen}
            disabled={isTransitioning}
            previewId={previewAlgorithmId}
            onPreview={setPreviewAlgorithmId}
            onOpenSelector={() => setSelectorOpen(true)}
            onCloseSelector={() => {
              setSelectorOpen(false)
              setPreviewAlgorithmId(null)
            }}
            onSelectAlgorithm={handleSelectAlgorithm}
          />
        </>
      ) : null}
      {location === 'algorithms' && selectedAlgorithm ? (
        <>
          <button
            type="button"
            className="museum-button lobby-button"
            onClick={handleBackToAlgorithms}
            disabled={isTransitioning}
          >
            ← Algorithms
          </button>
          <AlgorithmPlaque algorithm={selectedAlgorithm} />
          <AlgorithmPlaybackView
            playback={playback}
            disabled={isTransitioning}
          />
        </>
      ) : null}
    </div>
  )
}

export default App
