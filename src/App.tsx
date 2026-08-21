import { Canvas } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getAlgorithmSteps,
  getLinkedListVariantForAlgorithm,
  isHashTableAlgorithm,
  isLinkedListAlgorithm,
  isSortingCategory,
  usesHashTableInsert,
  usesHashTableSearch,
  usesLinkedListDelete,
  usesLinkedListInsert,
  usesLinkedListSearch,
  usesStartNodeSelection,
  usesTargetNodeSelection,
  usesTreeTargetSelection,
} from './algorithms/getAlgorithmSteps'
import {
  hashTableDataFromSnapshot,
  hashTableFingerprint,
} from './algorithms/hashTableShared'
import AlgorithmLegend from './components/algorithms/AlgorithmLegend'
import AlgorithmPlaybackView from './components/algorithms/AlgorithmPlaybackView'
import HashTableExplainPanel from './components/algorithms/HashTableExplainPanel'
import HashTableLegend from './components/algorithms/HashTableLegend'
import AlgorithmGalleryUi from './components/museum/AlgorithmGalleryUi'
import AlgorithmInstallationUi from './components/museum/AlgorithmInstallationUi'
import AlgorithmPlaque from './components/museum/AlgorithmPlaque'
import EntranceSequence from './components/museum/EntranceSequence'
import {
  ALGORITHM_SECTIONS,
  DATA_STRUCTURE_SECTIONS,
  getAlgorithmById,
  getGalleryEntries,
} from './data/algorithms'
import { getHashTableExhibitPrimer } from './data/hashTableOperations'
import { getLinkedListExhibitPrimer } from './data/linkedListOperations'
import { SAMPLE_GRAPH } from './data/sampleGraph'
import {
  createDefaultHashTable,
  DEFAULT_HASH_TABLE_DELETE_KEY,
  DEFAULT_HASH_TABLE_INSERT_PAIR,
  DEFAULT_HASH_TABLE_SEARCH_KEY,
  getHashTableSearchKeyGroups,
  normalizeHashTableInput,
} from './data/sampleHashTable'
import {
  createDefaultSortingValues,
  createRandomSortingValues,
} from './data/sampleSorting'
import {
  createDefaultTreeSearchTarget,
  getTreeSearchTargetGroups,
  SAMPLE_TREE,
} from './data/sampleTree'
import {
  createDefaultLinkedListSearchTarget,
  DEFAULT_LINKED_LIST_DELETE_POSITION,
  DEFAULT_LINKED_LIST_INSERT_POSITION,
  DEFAULT_LINKED_LIST_INSERT_VALUE,
  getLinkedListSearchTargetGroups,
  getSampleLinkedList,
  LINKED_LIST_INSERT_VALUES,
  LINKED_LIST_MUTATION_POSITIONS,
  linkedListMutationPositionKey,
} from './data/sampleLinkedList'
import { useAlgorithmPlayback } from './hooks/useAlgorithmPlayback'
import MuseumCameraController from './navigation/MuseumCameraController'
import {
  MUSEUM_DESTINATIONS,
  getMuseumDestination,
  type MuseumLocation,
} from './navigation/destinations'
import MuseumScene from './scenes/MuseumScene'
import type { AlgorithmCategory, AlgorithmId } from './types/algorithm'
import type { HashTableData } from './types/hashTable'
import type { LinkedListMutationPosition } from './types/linkedList'

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
  const [linkedListSearchTarget, setLinkedListSearchTarget] = useState(() =>
    createDefaultLinkedListSearchTarget(),
  )
  const [linkedListInsertValue, setLinkedListInsertValue] = useState(
    DEFAULT_LINKED_LIST_INSERT_VALUE,
  )
  const [linkedListInsertPosition, setLinkedListInsertPosition] =
    useState<LinkedListMutationPosition>(DEFAULT_LINKED_LIST_INSERT_POSITION)
  const [linkedListDeletePosition, setLinkedListDeletePosition] =
    useState<LinkedListMutationPosition>(DEFAULT_LINKED_LIST_DELETE_POSITION)
  const [hashTable, setHashTable] = useState<HashTableData>(
    createDefaultHashTable,
  )
  const [hashKeyInput, setHashKeyInput] = useState(
    DEFAULT_HASH_TABLE_INSERT_PAIR.key,
  )
  const [hashValueInput, setHashValueInput] = useState(
    DEFAULT_HASH_TABLE_INSERT_PAIR.value,
  )
  const pendingHashTable = useRef<HashTableData | null>(null)
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
  const showingLinkedList = Boolean(
    selectedAlgorithmId && isLinkedListAlgorithm(selectedAlgorithmId),
  )
  const linkedListVariant = selectedAlgorithmId
    ? getLinkedListVariantForAlgorithm(selectedAlgorithmId)
    : null
  const linkedList = linkedListVariant
    ? getSampleLinkedList(linkedListVariant)
    : getSampleLinkedList('singly')
  const linkedListSearchTargets = useMemo(
    () => getLinkedListSearchTargetGroups(linkedList),
    [linkedList],
  )
  const showingLinkedListSearch = Boolean(
    selectedAlgorithmId && usesLinkedListSearch(selectedAlgorithmId),
  )
  const showingLinkedListInsert = Boolean(
    selectedAlgorithmId && usesLinkedListInsert(selectedAlgorithmId),
  )
  const showingLinkedListDelete = Boolean(
    selectedAlgorithmId && usesLinkedListDelete(selectedAlgorithmId),
  )
  const showingHashTable = Boolean(
    selectedAlgorithmId && isHashTableAlgorithm(selectedAlgorithmId),
  )
  const showingHashTableInsert = Boolean(
    selectedAlgorithmId && usesHashTableInsert(selectedAlgorithmId),
  )
  const showingHashTableSearch = Boolean(
    selectedAlgorithmId && usesHashTableSearch(selectedAlgorithmId),
  )
  const hashKey = normalizeHashTableInput(hashKeyInput)
  const hashValue = normalizeHashTableInput(hashValueInput)
  const hashKeyError =
    showingHashTable && hashKey.length === 0
      ? 'Enter a key to run this operation.'
      : null
  const hashTableKeys = useMemo(
    () => getHashTableSearchKeyGroups(hashTable),
    [hashTable],
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
            targetValue: showingLinkedListSearch
              ? linkedListSearchTarget
              : treeTargetValue,
            list: linkedList,
            insertValue: linkedListInsertValue,
            insertPosition: linkedListInsertPosition,
            deletePosition: linkedListDeletePosition,
            table: hashTable,
            hashKey: hashKey.length > 0 ? hashKey : null,
            hashValue,
          })
        : [],
    [
      selectedAlgorithmId,
      startNodeId,
      targetNodeId,
      sortingValues,
      treeTargetValue,
      linkedList,
      linkedListSearchTarget,
      linkedListInsertValue,
      linkedListInsertPosition,
      linkedListDeletePosition,
      showingLinkedListSearch,
      hashTable,
      hashKey,
      hashValue,
    ],
  )
  const playback = useAlgorithmPlayback(
    steps,
    `${selectedAlgorithmId ?? ''}:${startNodeId ?? ''}:${targetNodeId ?? ''}:${sortingValues.join(',')}:${treeTargetValue}:${linkedList.variant}:${linkedListSearchTarget}:${linkedListInsertValue}:${linkedListMutationPositionKey(linkedListInsertPosition)}:${linkedListMutationPositionKey(linkedListDeletePosition)}:${hashTableFingerprint(hashTable)}:${hashKey}:${hashValue}`,
  )
  const canResetPlayback = Boolean(
    selectedAlgorithmId &&
      (usesStartNodeSelection(selectedAlgorithmId)
        ? startNodeId
        : steps.length > 0),
  )
  const isExhibitHall =
    location === 'algorithms' || location === 'data-structures'
  const algorithmViewPhase: AlgorithmViewPhase =
    !isExhibitHall || isTransitioning
      ? 'transitioning'
      : selectedAlgorithmId
        ? 'focused'
        : selectedGallery
          ? 'gallery'
          : 'overview'
  const hallLabel =
    location === 'data-structures' ? 'Data Structures' : 'Algorithms'
  const catalogSections =
    location === 'data-structures' ? DATA_STRUCTURE_SECTIONS : ALGORITHM_SECTIONS

  const resetLinkedListInputs = useCallback(() => {
    setLinkedListSearchTarget(createDefaultLinkedListSearchTarget())
    setLinkedListInsertValue(DEFAULT_LINKED_LIST_INSERT_VALUE)
    setLinkedListInsertPosition(DEFAULT_LINKED_LIST_INSERT_POSITION)
    setLinkedListDeletePosition(DEFAULT_LINKED_LIST_DELETE_POSITION)
  }, [])

  const resetHashTableInputsFor = useCallback((id: AlgorithmId | null) => {
    const pending = pendingHashTable.current
    pendingHashTable.current = null

    if (pending) {
      setHashTable(pending)
    }

    if (id === 'hash-table-search') {
      setHashKeyInput(DEFAULT_HASH_TABLE_SEARCH_KEY)
      setHashValueInput(DEFAULT_HASH_TABLE_INSERT_PAIR.value)
      return
    }

    if (id === 'hash-table-delete') {
      setHashKeyInput(DEFAULT_HASH_TABLE_DELETE_KEY)
      setHashValueInput(DEFAULT_HASH_TABLE_INSERT_PAIR.value)
      return
    }

    setHashKeyInput(DEFAULT_HASH_TABLE_INSERT_PAIR.key)
    setHashValueInput(DEFAULT_HASH_TABLE_INSERT_PAIR.value)
  }, [])

  const resetHashTableExhibit = useCallback(() => {
    pendingHashTable.current = null
    setHashTable(createDefaultHashTable())
    setHashKeyInput(DEFAULT_HASH_TABLE_INSERT_PAIR.key)
    setHashValueInput(DEFAULT_HASH_TABLE_INSERT_PAIR.value)
  }, [])

  useEffect(() => {
    if (!showingHashTable || !playback.isComplete) {
      return
    }

    const snapshot = playback.currentStep?.hashTableSnapshot

    if (snapshot) {
      pendingHashTable.current = hashTableDataFromSnapshot(snapshot)
    }
  }, [playback.currentStep, playback.isComplete, showingHashTable])

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
      resetLinkedListInputs()
      resetHashTableExhibit()
      setSelectorOpen(false)
      setLocation(next)
      setIsTransitioning(true)
    },
    [
      isTransitioning,
      location,
      resetHashTableExhibit,
      resetLinkedListInputs,
      selectedAlgorithmId,
    ],
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
      resetLinkedListInputs()
      resetHashTableInputsFor(id)

      if (gallery) {
        setSelectedGallery(gallery)
      }

      setSelectedAlgorithmId(id)
      setIsTransitioning(true)
    },
    [isTransitioning, resetHashTableInputsFor, resetLinkedListInputs],
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
      resetLinkedListInputs()
      resetHashTableExhibit()
      setSelectedGallery(category)
      setIsTransitioning(true)
    },
    [
      isTransitioning,
      resetHashTableExhibit,
      resetLinkedListInputs,
      selectedAlgorithmId,
      selectedGallery,
    ],
  )

  const handleBackToAlgorithms = useCallback(() => {
    if (isTransitioning) {
      return
    }

    setSelectedAlgorithmId(null)
    setPreviewAlgorithmId(null)
    setStartNodeId(null)
    setTargetNodeId(null)
    resetLinkedListInputs()
    resetHashTableExhibit()
    setSelectorOpen(false)
    setIsTransitioning(true)
  }, [isTransitioning, resetHashTableExhibit, resetLinkedListInputs])

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

    if (selectedAlgorithmId && isLinkedListAlgorithm(selectedAlgorithmId)) {
      playback.pause()
      resetLinkedListInputs()
      playback.reset()
      return
    }

    if (selectedAlgorithmId && isHashTableAlgorithm(selectedAlgorithmId)) {
      playback.pause()
      pendingHashTable.current = null
      resetHashTableInputsFor(selectedAlgorithmId)
      playback.reset()
      return
    }

    playback.reset()
  }, [
    playback,
    resetHashTableInputsFor,
    resetLinkedListInputs,
    selectedAlgorithmId,
  ])

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

  const handleSelectLinkedListSearchTarget = useCallback(
    (value: number) => {
      if (playback.isPlaying) {
        return
      }

      playback.pause()
      setLinkedListSearchTarget(value)
      playback.reset()
    },
    [playback],
  )

  const handleSelectLinkedListInsertValue = useCallback(
    (value: number) => {
      if (playback.isPlaying) {
        return
      }

      playback.pause()
      setLinkedListInsertValue(value)
      playback.reset()
    },
    [playback],
  )

  const handleSelectLinkedListInsertPosition = useCallback(
    (position: LinkedListMutationPosition) => {
      if (playback.isPlaying) {
        return
      }

      playback.pause()
      setLinkedListInsertPosition(position)
      playback.reset()
    },
    [playback],
  )

  const handleSelectLinkedListDeletePosition = useCallback(
    (position: LinkedListMutationPosition) => {
      if (playback.isPlaying) {
        return
      }

      playback.pause()
      setLinkedListDeletePosition(position)
      playback.reset()
    },
    [playback],
  )

  const commitPendingHashTable = useCallback(() => {
    const pending = pendingHashTable.current
    pendingHashTable.current = null

    if (pending) {
      setHashTable(pending)
    }
  }, [])

  const handleChangeHashKey = useCallback(
    (value: string) => {
      if (playback.isPlaying) {
        return
      }

      playback.pause()
      commitPendingHashTable()
      setHashKeyInput(value)
      playback.reset()
    },
    [commitPendingHashTable, playback],
  )

  const handleChangeHashValue = useCallback(
    (value: string) => {
      if (playback.isPlaying) {
        return
      }

      playback.pause()
      commitPendingHashTable()
      setHashValueInput(value)
      playback.reset()
    },
    [commitPendingHashTable, playback],
  )

  const handleSelectHashKey = useCallback(
    (key: string, value?: string) => {
      if (playback.isPlaying) {
        return
      }

      playback.pause()
      commitPendingHashTable()
      setHashKeyInput(key)

      if (value !== undefined) {
        setHashValueInput(value)
      }

      playback.reset()
    },
    [commitPendingHashTable, playback],
  )

  const handleResetHashTable = useCallback(() => {
    playback.pause()
    pendingHashTable.current = null
    setHashTable(createDefaultHashTable())
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
          onSelectDataStructures={() => goToLocation('data-structures')}
          selectedGallery={selectedGallery}
          onSelectGallery={handleSelectGallery}
          onSelectGalleryAlgorithm={handleSelectAlgorithm}
          galleryInteractive={
            isExhibitHall && !selectedAlgorithmId && !isTransitioning
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
              sections={catalogSections}
              chooseLabel={
                location === 'data-structures'
                  ? 'Choose Operation'
                  : 'Choose Algorithm'
              }
              selectorTitle={
                location === 'data-structures'
                  ? 'Choose operation'
                  : 'Choose algorithm'
              }
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
                sections={catalogSections}
                chooseLabel={
                  location === 'data-structures'
                    ? 'Choose Operation'
                    : 'Choose Algorithm'
                }
                selectorTitle={
                  location === 'data-structures'
                    ? 'Choose operation'
                    : 'Choose algorithm'
                }
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
            ← {hallLabel}
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
            {selectedGallery ? `← ${selectedGallery}` : `← ${hallLabel}`}
          </button>
          <AlgorithmLegend algorithmId={selectedAlgorithm.id} />
          <div className="algorithm-focused-ui">
            {showingHashTable ? (
              <div className="hash-table-side">
                <HashTableLegend />
                <HashTableExplainPanel
                  snapshot={playback.currentStep?.hashTableSnapshot ?? null}
                  description={playback.currentStep?.description}
                  inspection={playback.currentStep?.inspection}
                />
              </div>
            ) : null}
            <AlgorithmPlaque
              algorithm={selectedAlgorithm}
              primer={
                getLinkedListExhibitPrimer(selectedAlgorithm.category) ??
                getHashTableExhibitPrimer(selectedAlgorithm.category)
              }
            />
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
              linkedList={
                showingLinkedList &&
                (showingLinkedListSearch ||
                  showingLinkedListInsert ||
                  showingLinkedListDelete)
                  ? {
                      mode: showingLinkedListSearch
                        ? 'search'
                        : showingLinkedListInsert
                          ? 'insert'
                          : 'delete',
                      disabled: playback.isPlaying,
                      search: showingLinkedListSearch
                        ? {
                            targetValue: linkedListSearchTarget,
                            presentValues: linkedListSearchTargets.present,
                            missingValues: linkedListSearchTargets.missing,
                            onSelectTarget: handleSelectLinkedListSearchTarget,
                          }
                        : undefined,
                      insert: showingLinkedListInsert
                        ? {
                            value: linkedListInsertValue,
                            values: [...LINKED_LIST_INSERT_VALUES],
                            position: linkedListInsertPosition,
                            positions: LINKED_LIST_MUTATION_POSITIONS,
                            onSelectValue: handleSelectLinkedListInsertValue,
                            onSelectPosition:
                              handleSelectLinkedListInsertPosition,
                          }
                        : undefined,
                      delete: showingLinkedListDelete
                        ? {
                            position: linkedListDeletePosition,
                            positions: LINKED_LIST_MUTATION_POSITIONS,
                            onSelectPosition:
                              handleSelectLinkedListDeletePosition,
                          }
                        : undefined,
                    }
                  : undefined
              }
              hashTable={
                showingHashTable
                  ? {
                      mode: showingHashTableInsert
                        ? 'insert'
                        : showingHashTableSearch
                          ? 'search'
                          : 'delete',
                      disabled: playback.isPlaying,
                      hashKey: hashKeyInput,
                      hashValue: hashValueInput,
                      presentKeys: hashTableKeys.present,
                      missingKeys: hashTableKeys.missing,
                      error: hashKeyError,
                      snapshot:
                        playback.currentStep?.hashTableSnapshot ?? null,
                      onChangeKey: handleChangeHashKey,
                      onChangeValue: handleChangeHashValue,
                      onSelectKey: handleSelectHashKey,
                      onResetTable: handleResetHashTable,
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
