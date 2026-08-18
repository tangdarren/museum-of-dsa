import { Canvas } from '@react-three/fiber'
import { useCallback, useMemo, useState } from 'react'
import {
  getAlgorithmSteps,
  isSortingCategory,
  usesStartNodeSelection,
  usesTargetNodeSelection,
  usesTreeTargetSelection,
} from './algorithms/getAlgorithmSteps'
import AlgorithmLegend from './components/algorithms/AlgorithmLegend'
import AlgorithmPlaybackView from './components/algorithms/AlgorithmPlaybackView'
import AlgorithmGalleryUi from './components/museum/AlgorithmGalleryUi'
import AlgorithmInstallationUi from './components/museum/AlgorithmInstallationUi'
import AlgorithmPlaque from './components/museum/AlgorithmPlaque'
import EntranceSequence from './components/museum/EntranceSequence'
import { getAlgorithmById, getGalleryEntries } from './data/algorithms'
import { SAMPLE_GRAPH } from './data/sampleGraph'
import {
  createDefaultSortingValues,
  createRandomSortingValues,
} from './data/sampleSorting'
import {
  SAMPLE_TREE,
  createDefaultTreeSearchTarget,
  getTreeSearchTargetGroups,
} from './data/sampleTree'
import { useAlgorithmPlayback } from './hooks/useAlgorithmPlayback'
import MuseumCameraController from './navigation/MuseumCameraController'
import {
  MUSEUM_DESTINATIONS,
  getMuseumDestination,
  type MuseumLocation,
} from './navigation/destinations'
import MuseumScene from './scenes/MuseumScene'
import type { AlgorithmCategory, AlgorithmId } from './types/algorithm'

type AlgorithmViewPhase = 'transitioning' | 'overview' | 'gallery' | 'focused'

function App() {
  const [location, setLocation] = useState<MuseumLocation>('entrance')
  const [selectedAlgorithmId, setSelectedAlgorithmId] =
    useState<AlgorithmId | null>(null)
  const [selectedGallery, setSelectedGallery] =
    useState<AlgorithmCategory | null>(null)
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
  const [treeTargetValue, setTreeTargetValue] = useState(() =>
    createDefaultTreeSearchTarget(SAMPLE_TREE),
  )
  const treeSearchTargets = useMemo(
    () => getTreeSearchTargetGroups(SAMPLE_TREE),
    [],
  )

  const selectedAlgorithm = selectedAlgorithmId
    ? getAlgorithmById(selectedAlgorithmId)
    : null
  const previewAlgorithm = previewAlgorithmId
    ? getAlgorithmById(previewAlgorithmId)
    : null
  const destination = getMuseumDestination(
    location,
    selectedAlgorithmId,
    selectedGallery,
  )
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
  const showingTreeSearch = Boolean(
    selectedAlgorithmId && usesTreeTargetSelection(selectedAlgorithmId),
  )
  const steps = useMemo(
    () =>
      selectedAlgorithmId
        ? getAlgorithmSteps(selectedAlgorithmId, {
            graph: SAMPLE_GRAPH,
            startNodeId,
            targetNodeId,
            values: sortingValues,
            tree: SAMPLE_TREE,
            targetValue: treeTargetValue,
          })
        : [],
    [selectedAlgorithmId, startNodeId, targetNodeId, sortingValues, treeTargetValue],
  )
  const playback = useAlgorithmPlayback(
    steps,
    `${selectedAlgorithmId ?? ''}:${startNodeId ?? ''}:${targetNodeId ?? ''}:${sortingValues.join(',')}:${treeTargetValue}`,
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
        : selectedGallery
          ? 'gallery'
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
      setSelectedGallery(null)
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
    (id: AlgorithmId, gallery?: AlgorithmCategory) => {
      if (isTransitioning) {
        return
      }

      setSelectorOpen(false)
      setPreviewAlgorithmId(null)
      setStartNodeId(null)
      setTargetNodeId(null)

      if (gallery) {
        setSelectedGallery(gallery)
      }

      setSelectedAlgorithmId(id)
      setIsTransitioning(true)
    },
    [isTransitioning],
  )

  const handleSelectGallery = useCallback(
    (category: AlgorithmCategory) => {
      if (isTransitioning) {
        return
      }

      if (selectedGallery === category && !selectedAlgorithmId) {
        return
      }

      setSelectorOpen(false)
      setPreviewAlgorithmId(null)
      setSelectedAlgorithmId(null)
      setStartNodeId(null)
      setTargetNodeId(null)
      setSelectedGallery(category)
      setIsTransitioning(true)
    },
    [isTransitioning, selectedAlgorithmId, selectedGallery],
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

  const handleBackToHall = useCallback(() => {
    if (isTransitioning) {
      return
    }

    setSelectedGallery(null)
    setPreviewAlgorithmId(null)
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

  const handleSelectTreeSearchTarget = useCallback(
    (value: number) => {
      playback.pause()
      setTreeTargetValue(value)
      playback.reset()
    },
    [playback],
  )

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
            algorithmViewPhase === 'overview' || algorithmViewPhase === 'gallery'
              ? previewAlgorithm
              : null
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
          selectedGallery={selectedGallery}
          onSelectGallery={handleSelectGallery}
          onSelectGalleryAlgorithm={handleSelectAlgorithm}
          galleryInteractive={
            location === 'algorithms' &&
            !selectedAlgorithmId &&
            !isTransitioning
          }
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
      {algorithmViewPhase === 'gallery' && selectedGallery ? (
        <>
          <button
            type="button"
            className="museum-button lobby-button"
            onClick={handleBackToHall}
          >
            ← Algorithms
          </button>
          <AlgorithmGalleryUi
            category={selectedGallery}
            entries={getGalleryEntries(selectedGallery)}
            previewId={previewAlgorithmId}
            onPreview={setPreviewAlgorithmId}
            onSelect={(id) => handleSelectAlgorithm(id, selectedGallery)}
          />
        </>
      ) : null}
      {algorithmViewPhase === 'focused' && selectedAlgorithm ? (
        <>
          <button
            type="button"
            className="museum-button lobby-button"
            onClick={handleBackToAlgorithms}
          >
            {selectedGallery ? `← ${selectedGallery}` : '← Algorithms'}
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
              treeSearch={
                showingTreeSearch
                  ? {
                      targetValue: treeTargetValue,
                      presentValues: treeSearchTargets.present,
                      missingValues: treeSearchTargets.missing,
                      onSelectTarget: handleSelectTreeSearchTarget,
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
