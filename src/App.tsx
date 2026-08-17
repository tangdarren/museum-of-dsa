import { Canvas } from '@react-three/fiber'
import { useCallback, useMemo, useState } from 'react'
import {
  getAlgorithmSteps,
  isSortingCategory,
  usesStartNodeSelection,
  usesTargetNodeSelection,
} from './algorithms/getAlgorithmSteps'
import AlgorithmLegend from './components/algorithms/AlgorithmLegend'
import AlgorithmPlaybackView from './components/algorithms/AlgorithmPlaybackView'
import AlgorithmInstallationUi from './components/museum/AlgorithmInstallationUi'
import AlgorithmPlaque from './components/museum/AlgorithmPlaque'
import EntranceSequence from './components/museum/EntranceSequence'
import { getAlgorithmById } from './data/algorithms'
import { SAMPLE_GRAPH } from './data/sampleGraph'
import {
  createDefaultSortingValues,
  createRandomSortingValues,
} from './data/sampleSorting'
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
  const [sceneReady, setSceneReady] = useState(false)
  const [startNodeId, setStartNodeId] = useState<string | null>(null)
  const [targetNodeId, setTargetNodeId] = useState<string | null>(null)
  const [sortingValues, setSortingValues] = useState<number[]>(() =>
    createDefaultSortingValues(),
  )

  const selectedAlgorithm = selectedAlgorithmId
    ? getAlgorithmById(selectedAlgorithmId)
    : null
  const previewAlgorithm = previewAlgorithmId
    ? getAlgorithmById(previewAlgorithmId)
    : null
  const destination = getMuseumDestination(location, selectedAlgorithmId)
  const needsTarget = Boolean(
    selectedAlgorithmId && usesTargetNodeSelection(selectedAlgorithmId),
  )
  const selectionPrompt =
    selectedAlgorithmId && usesStartNodeSelection(selectedAlgorithmId)
      ? !startNodeId
        ? 'start'
        : needsTarget && !targetNodeId
          ? 'target'
          : null
      : null
  const setupNodeStates = useMemo(
    () => ({
      ...(startNodeId ? { [startNodeId]: 'start' as const } : {}),
      ...(targetNodeId ? { [targetNodeId]: 'target' as const } : {}),
    }),
    [startNodeId, targetNodeId],
  )
  const showingSorting = Boolean(
    selectedAlgorithm && isSortingCategory(selectedAlgorithm.category),
  )
  const steps = useMemo(
    () =>
      selectedAlgorithmId
        ? getAlgorithmSteps(selectedAlgorithmId, {
            graph: SAMPLE_GRAPH,
            startNodeId,
            targetNodeId,
            values: sortingValues,
          })
        : [],
    [selectedAlgorithmId, startNodeId, targetNodeId, sortingValues],
  )
  const playback = useAlgorithmPlayback(
    steps,
    `${selectedAlgorithmId ?? ''}:${startNodeId ?? ''}:${targetNodeId ?? ''}:${sortingValues.join(',')}`,
  )
  const canResetPlayback = Boolean(
    selectedAlgorithmId &&
      (usesStartNodeSelection(selectedAlgorithmId)
        ? startNodeId
        : steps.length > 0),
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
      setTargetNodeId(null)
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
      setTargetNodeId(null)
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
    setTargetNodeId(null)
    setSelectorOpen(false)
    setIsTransitioning(true)
  }, [isTransitioning])

  const handleArrived = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  const handleSelectGraphNode = useCallback(
    (nodeId: string) => {
      if (!startNodeId) {
        setStartNodeId(nodeId)
        return
      }

      if (needsTarget && !targetNodeId) {
        setTargetNodeId(nodeId)
      }
    },
    [needsTarget, startNodeId, targetNodeId],
  )

  const handlePlaybackReset = useCallback(() => {
    if (
      selectedAlgorithmId &&
      usesStartNodeSelection(selectedAlgorithmId)
    ) {
      setStartNodeId(null)
      setTargetNodeId(null)
      return
    }

    playback.reset()
  }, [playback, selectedAlgorithmId])

  const handleRandomizeArray = useCallback(() => {
    playback.pause()
    setSortingValues(createRandomSortingValues())
    playback.reset()
  }, [playback])

  const handleResetArray = useCallback(() => {
    playback.pause()
    setSortingValues(createDefaultSortingValues())
    playback.reset()
  }, [playback])

  return (
    <div className="app">
      <Canvas
        shadows
        camera={{
          position: MUSEUM_DESTINATIONS.entrance.cameraPosition,
          fov: 46,
        }}
        onCreated={() => {
          requestAnimationFrame(() => {
            setSceneReady(true)
          })
        }}
      >
        <MuseumCameraController
          destination={destination}
          onArrived={handleArrived}
        />
        <MuseumScene
          location={location}
          selectedAlgorithm={selectedAlgorithm}
          previewAlgorithm={
            algorithmViewPhase === 'overview' ? previewAlgorithm : null
          }
          playbackStep={selectedAlgorithm ? playback.currentStep : null}
          selectionPrompt={
            algorithmViewPhase === 'focused' ? selectionPrompt : null
          }
          setupNodeStates={
            selectedAlgorithm ? setupNodeStates : undefined
          }
          onSelectNode={
            algorithmViewPhase === 'focused' && selectionPrompt
              ? handleSelectGraphNode
              : undefined
          }
          onSelectAlgorithms={() => goToLocation('algorithms')}
          isTransitioning={isTransitioning}
          showEntranceLettering={enterButton === 'gone'}
        />
      </Canvas>
      {enterButton !== 'gone' ? (
        <EntranceSequence
          sceneReady={sceneReady}
          fading={enterButton === 'fading'}
          enterDisabled={enterButton !== 'active'}
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
          <AlgorithmLegend algorithmId={selectedAlgorithm.id} />
          <div className="algorithm-focused-ui">
            <AlgorithmPlaque algorithm={selectedAlgorithm} />
            <AlgorithmPlaybackView
              playback={playback}
              onReset={handlePlaybackReset}
              allowReset={canResetPlayback}
              selectionPrompt={selectionPrompt}
              sorting={
                showingSorting
                  ? {
                      algorithmId: selectedAlgorithm.id,
                      metrics:
                        playback.currentStep?.sortingSnapshot?.metrics ?? null,
                      sortedValues: playback.isComplete
                        ? playback.currentStep?.sortingSnapshot?.values
                        : undefined,
                      onRandomizeArray: handleRandomizeArray,
                      onResetArray: handleResetArray,
                    }
                  : undefined
              }
            />
          </div>
        </>
      ) : null}
    </div>
  )
}

export default App
