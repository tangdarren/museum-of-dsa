import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { MeshStandardMaterial, SpotLight } from 'three'
import { mapAlgorithmStepToGraph } from '../algorithms/mapAlgorithmStepToGraph'
import { ALGORITHM_PREVIEWS } from '../../data/algorithmPreviews'
import { ALGORITHM_INSTALLATION_POSITION } from '../../navigation/destinations'
import { museum } from '../../theme/palette'
import type { AlgorithmDefinition } from '../../types/algorithm'
import type { AlgorithmStep } from '../../types/algorithmStep'
import GraphVisualization from '../visualizations/graph/GraphVisualization'
import { SAMPLE_GRAPH } from '../../data/sampleGraph'
import AmbientComputationField from './AmbientComputationField'

type AlgorithmInstallationProps = {
  algorithm: AlgorithmDefinition | null
  preview: AlgorithmDefinition | null
  playbackStep: AlgorithmStep | null
  selectingStart?: boolean
  onSelectNode?: (nodeId: string) => void
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function AlgorithmInstallation({
  algorithm,
  preview,
  playbackStep,
  selectingStart = false,
  onSelectNode,
}: AlgorithmInstallationProps) {
  const displayed = algorithm ?? preview
  const inspection = algorithm !== null
  const previewing = preview !== null && algorithm === null
  const previewConfig = preview && !algorithm ? ALGORITHM_PREVIEWS[preview.id] : null
  const playbackGraph = mapAlgorithmStepToGraph(playbackStep)
  const graphStates =
    algorithm && playbackStep
      ? playbackGraph
      : {
          nodeStates: previewConfig?.nodeStates ?? {},
          edgeStates: previewConfig?.edgeStates ?? {},
        }
  const showWeights = Boolean(previewConfig?.showWeights && !algorithm)
  const edgeRefs = useRef<(MeshStandardMaterial | null)[]>([])
  const screenRef = useRef<MeshStandardMaterial>(null)
  const plateRef = useRef<MeshStandardMaterial>(null)
  const lightRef = useRef<SpotLight>(null)
  const blend = useRef(0)
  const reduced = useRef(prefersReducedMotion())

  useFrame((_, delta) => {
    const goal = inspection ? 1 : previewing ? 0.45 : 0
    blend.current = reduced.current
      ? goal
      : blend.current + (goal - blend.current) * Math.min(1, delta * 2.2)
    const t = blend.current

    if (screenRef.current) {
      screenRef.current.emissiveIntensity = 0.08 + t * 0.16
    }

    if (plateRef.current) {
      plateRef.current.emissiveIntensity = 0.04 + t * 0.08
    }

    edgeRefs.current.forEach((material) => {
      if (material) {
        material.emissiveIntensity = 0.12 + t * 0.28
      }
    })

    if (lightRef.current) {
      lightRef.current.intensity = 11 + t * 8
    }
  })

  return (
    <group position={ALGORITHM_INSTALLATION_POSITION}>
      <mesh position={[0, 0.16, 0.06]} receiveShadow>
        <boxGeometry args={[12.8, 0.32, 1.7]} />
        <meshStandardMaterial
          color={museum.stone}
          roughness={0.86}
          metalness={0.04}
        />
      </mesh>
      <mesh position={[0, 0.34, 0.06]}>
        <boxGeometry args={[12.86, 0.05, 1.76]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.55}
        />
      </mesh>
      <mesh position={[0, 0.42, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[12.2, 0.18, 1.28]} />
        <meshStandardMaterial
          color={museum.stoneDeep}
          roughness={0.8}
          metalness={0.06}
        />
      </mesh>
      <mesh position={[0, 0.52, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[12.45, 0.05, 1.42]} />
        <meshStandardMaterial
          color={museum.brass}
          roughness={0.34}
          metalness={0.58}
        />
      </mesh>
      <mesh position={[-4.2, 0.88, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.72, 0.24]} />
        <meshStandardMaterial
          color={museum.column}
          roughness={0.72}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[4.2, 0.88, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.72, 0.24]} />
        <meshStandardMaterial
          color={museum.column}
          roughness={0.72}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[-4.2, 0.54, -0.08]}>
        <boxGeometry args={[0.36, 0.08, 0.28]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.36}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[4.2, 0.54, -0.08]}>
        <boxGeometry args={[0.36, 0.08, 0.28]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.36}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[0, 3.2, -0.28]} receiveShadow>
        <boxGeometry args={[12.5, 6.15, 0.18]} />
        <meshStandardMaterial
          color={museum.wallDeep}
          roughness={0.8}
          metalness={0.03}
        />
      </mesh>
      <mesh position={[0, 3.2, -0.18]}>
        <boxGeometry args={[12.62, 6.28, 0.04]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      <mesh position={[0, 3.2, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[12.15, 5.85, 0.22]} />
        <meshStandardMaterial
          color={museum.charcoal}
          roughness={0.48}
          metalness={0.18}
        />
      </mesh>
      <mesh position={[0, 3.2, 0.1]} castShadow>
        <boxGeometry args={[11.55, 5.25, 0.14]} />
        <meshStandardMaterial
          color={museum.slate}
          roughness={0.42}
          metalness={0.16}
        />
      </mesh>
      <mesh position={[0, 3.2, 0.16]}>
        <boxGeometry args={[11.15, 4.85, 0.06]} />
        <meshStandardMaterial
          color={museum.slateDeep}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 3.2, 0.19]}>
        <boxGeometry args={[10.85, 4.55, 0.03]} />
        <meshStandardMaterial
          ref={screenRef}
          color={museum.screen}
          emissive={museum.tealDeep}
          emissiveIntensity={0.08}
          roughness={0.62}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[-5.46, 3.2, 0.21]}>
        <boxGeometry args={[0.02, 4.48, 0.012]} />
        <meshStandardMaterial
          ref={(material) => {
            edgeRefs.current[0] = material
          }}
          color={museum.brass}
          emissive={museum.brass}
          emissiveIntensity={0.12}
          roughness={0.32}
          metalness={0.55}
        />
      </mesh>
      <mesh position={[5.46, 3.2, 0.21]}>
        <boxGeometry args={[0.02, 4.48, 0.012]} />
        <meshStandardMaterial
          ref={(material) => {
            edgeRefs.current[1] = material
          }}
          color={museum.brass}
          emissive={museum.brass}
          emissiveIntensity={0.12}
          roughness={0.32}
          metalness={0.55}
        />
      </mesh>
      <mesh position={[0, 5.43, 0.21]}>
        <boxGeometry args={[10.94, 0.02, 0.012]} />
        <meshStandardMaterial
          ref={(material) => {
            edgeRefs.current[2] = material
          }}
          color={museum.brass}
          emissive={museum.brass}
          emissiveIntensity={0.12}
          roughness={0.32}
          metalness={0.55}
        />
      </mesh>
      <mesh position={[0, 0.97, 0.21]}>
        <boxGeometry args={[10.94, 0.02, 0.012]} />
        <meshStandardMaterial
          ref={(material) => {
            edgeRefs.current[3] = material
          }}
          color={museum.brass}
          emissive={museum.brass}
          emissiveIntensity={0.12}
          roughness={0.32}
          metalness={0.55}
        />
      </mesh>

      <mesh position={[0, 0.72, 0.52]} castShadow>
        <boxGeometry args={[1.78, 0.26, 0.05]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.36}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[0, 0.72, 0.55]}>
        <boxGeometry args={[1.68, 0.2, 0.03]} />
        <meshStandardMaterial
          color={museum.charcoal}
          roughness={0.45}
          metalness={0.12}
        />
      </mesh>
      <Text
        position={[0, 0.72, 0.575]}
        fontSize={0.08}
        color={museum.cream}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.16}
      >
        ALGORITHMS
      </Text>

      <group position={[0, 3.2, 0.22]} scale={[4.6, 2.5, 1]}>
        <AmbientComputationField visible={!displayed} />
      </group>

      {displayed ? (
        <group>
          <Text
            position={[0, 5.12, 0.22]}
            fontSize={0.2}
            color={museum.cream}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
            maxWidth={9.6}
            textAlign="center"
          >
            {displayed.title.toUpperCase()}
          </Text>
          <Text
            position={[0, 4.82, 0.22]}
            fontSize={0.1}
            color={museum.brassMuted}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.14}
          >
            {displayed.category}
          </Text>
          <mesh position={[0, 4.66, 0.21]}>
            <boxGeometry args={[1.35, 0.012, 0.008]} />
            <meshStandardMaterial
              color={museum.brass}
              emissive={museum.brass}
              emissiveIntensity={0.2}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          {selectingStart ? (
            <Text
              position={[0, 4.42, 0.22]}
              fontSize={0.09}
              color={museum.brassMuted}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.16}
            >
              SELECT A START NODE
            </Text>
          ) : null}
          <mesh position={[0, 2.95, 0.2]}>
            <boxGeometry args={[9.45, 3.32, 0.018]} />
            <meshStandardMaterial
              color={museum.bronze}
              roughness={0.38}
              metalness={0.48}
            />
          </mesh>
          <mesh position={[0, 2.95, 0.208]}>
            <boxGeometry args={[9.18, 3.08, 0.02]} />
            <meshStandardMaterial
              ref={plateRef}
              color={museum.plate}
              emissive={museum.tealDeep}
              emissiveIntensity={0.04}
              roughness={0.7}
              metalness={0.06}
            />
          </mesh>
          <group
            position={[0, 3.02, 0.23]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={2.7}
          >
            <GraphVisualization
              graph={SAMPLE_GRAPH}
              nodeStates={graphStates.nodeStates}
              edgeStates={graphStates.edgeStates}
              showWeights={showWeights}
              onSelectNode={selectingStart ? onSelectNode : undefined}
            />
          </group>
        </group>
      ) : (
        <group>
          <Text
            position={[0, 3.7, 0.22]}
            fontSize={0.46}
            color={museum.cream}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.16}
          >
            ALGORITHMS
          </Text>
          <mesh position={[0, 3.38, 0.21]}>
            <boxGeometry args={[1.6, 0.014, 0.008]} />
            <meshStandardMaterial
              color={museum.brass}
              emissive={museum.brass}
              emissiveIntensity={0.18}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          <Text
            position={[0, 3.05, 0.22]}
            fontSize={0.16}
            color={museum.brassMuted}
            anchorX="center"
            anchorY="middle"
            maxWidth={8.2}
            textAlign="center"
            lineHeight={1.35}
          >
            Explore how computers solve problems step by step.
          </Text>
        </group>
      )}

      <spotLight
        ref={lightRef}
        position={[0, 6.8, 4.2]}
        angle={0.58}
        penumbra={0.8}
        intensity={12}
        distance={16}
        color={museum.lightWarm}
      />
    </group>
  )
}

export default AlgorithmInstallation
