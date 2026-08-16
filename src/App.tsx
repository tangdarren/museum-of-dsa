import { Canvas } from '@react-three/fiber'
import { useCallback, useMemo, useState } from 'react'
import {
  getAlgorithmSteps,
  usesStartNodeSelection,
} from './algorithms/getAlgorithmSteps'
import AlgorithmPlaybackView from './components/algorithms/AlgorithmPlaybackView'
import AlgorithmInstallationUi from './components/museum/AlgorithmInstallationUi'
import AlgorithmPlaque from './components/museum/AlgorithmPlaque'
import EnterMuseumButton from './components/museum/EnterMuseumButton'
import { getAlgorithmById } from './data/algorithms'
import { SAMPLE_GRAPH } from './data/sampleGraph'
import { useAlgorithmPlayback } from './hooks/useAlgorithmPlayback'
import MuseumCameraController from './navigation/MuseumCameraController'
import {
  MUSEUM_DESTINATIONS,
  getMuseumDestination,
  type MuseumLocation,
} from './navigation/destinations'
import MuseumScene from './scenes/MuseumScene'
import type { AlgorithmId } from './types/algorithm'

type AlgorithmViewPhase = 'transitioning' | 'overview' | 'focused'

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
  const [startNodeId, setStartNodeId] = useState<string | null>(null)

  const selectedAlgorithm = selectedAlgorithmId
    ? getAlgorithmById(selectedAlgorithmId)
    : null
  const previewAlgorithm = previewAlgorithmId
    ? getAlgorithmById(previewAlgorithmId)
    : null
  const destination = getMuseumDestination(location, selectedAlgorithmId)
  const awaitingStart = Boolean(
    selectedAlgorithmId &&
      usesStartNodeSelection(selectedAlgorithmId) &&
      !startNodeId,
  )
  const steps = useMemo(
    () =>
      selectedAlgorithmId
        ? getAlgorithmSteps(selectedAlgorithmId, SAMPLE_GRAPH, startNodeId)
        : [],
    [selectedAlgorithmId, startNodeId],
  )
  const playback = useAlgorithmPlayback(
    steps,
    `${selectedAlgorithmId ?? ''}:${startNodeId ?? ''}`,
  )
  const algorithmViewPhase: AlgorithmViewPhase =
    location !== 'algorithms' || isTransitioning
      ? 'transitioning'
      : selectedAlgorithmId
        ? 'focused'
        : 'overview'

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
      setStartNodeId(null)
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
      setStartNodeId(null)
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
    setStartNodeId(null)
    setSelectorOpen(false)
    setIsTransitioning(true)
  }, [isTransitioning])

  const handleArrived = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  const handleSelectStartNode = useCallback((nodeId: string) => {
    setStartNodeId(nodeId)
  }, [])

  const handlePlaybackReset = useCallback(() => {
    if (
      selectedAlgorithmId &&
      usesStartNodeSelection(selectedAlgorithmId)
    ) {
      setStartNodeId(null)
      return
    }

    playback.reset()
  }, [playback, selectedAlgorithmId])

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
          selectedAlgorithm={
            algorithmViewPhase === 'focused' ? selectedAlgorithm : null
          }
          previewAlgorithm={
            algorithmViewPhase === 'overview' ? previewAlgorithm : null
          }
          playbackStep={
            algorithmViewPhase === 'focused' ? playback.currentStep : null
          }
          selectingStart={
            algorithmViewPhase === 'focused' && awaitingStart
          }
          onSelectNode={
            algorithmViewPhase === 'focused' && awaitingStart
              ? handleSelectStartNode
              : undefined
          }
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
      {algorithmViewPhase === 'overview' ? (
        <>
          <button
            type="button"
            className="museum-button lobby-button"
            onClick={() => goToLocation('lobby')}
          >
            ← Lobby
          </button>
          {selectorOpen ? (
            <AlgorithmInstallationUi
              selectorOpen
              disabled={false}
              previewId={previewAlgorithmId}
              onPreview={setPreviewAlgorithmId}
              onOpenSelector={() => setSelectorOpen(true)}
              onCloseSelector={() => {
                setSelectorOpen(false)
                setPreviewAlgorithmId(null)
              }}
              onSelectAlgorithm={handleSelectAlgorithm}
            />
          ) : (
            <div className="algorithm-stage">
              <AlgorithmInstallationUi
                selectorOpen={false}
                disabled={false}
                previewId={previewAlgorithmId}
                onPreview={setPreviewAlgorithmId}
                onOpenSelector={() => setSelectorOpen(true)}
                onCloseSelector={() => {
                  setSelectorOpen(false)
                  setPreviewAlgorithmId(null)
                }}
                onSelectAlgorithm={handleSelectAlgorithm}
              />
            </div>
          )}
        </>
      ) : null}
      {algorithmViewPhase === 'focused' && selectedAlgorithm ? (
        <>
          <button
            type="button"
            className="museum-button lobby-button"
            onClick={handleBackToAlgorithms}
          >
            ← Algorithms
          </button>
          <div className="algorithm-focused-ui">
            <AlgorithmPlaque algorithm={selectedAlgorithm} />
            <AlgorithmPlaybackView
              playback={{
                ...playback,
                reset: handlePlaybackReset,
              }}
              awaitingStart={awaitingStart}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}

export default App
