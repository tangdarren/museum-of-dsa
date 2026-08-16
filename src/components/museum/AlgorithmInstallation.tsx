import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { MeshStandardMaterial, SpotLight } from 'three'
import { mapAlgorithmStepToGraph } from '../algorithms/mapAlgorithmStepToGraph'
import { ALGORITHM_PREVIEWS } from '../../data/algorithmPreviews'
import { ALGORITHM_INSTALLATION_POSITION } from '../../navigation/destinations'
import type { AlgorithmDefinition } from '../../types/algorithm'
import type { AlgorithmStep } from '../../types/algorithmStep'
import GraphVisualization from '../visualizations/graph/GraphVisualization'
import { SAMPLE_GRAPH } from '../../data/sampleGraph'
import AmbientComputationField from './AmbientComputationField'

type AlgorithmInstallationProps = {
  algorithm: AlgorithmDefinition | null
  preview: AlgorithmDefinition | null
  playbackStep: AlgorithmStep | null
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function AlgorithmInstallation({
  algorithm,
  preview,
  playbackStep,
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
      screenRef.current.emissiveIntensity = 0.06 + t * 0.12
    }

    if (plateRef.current) {
      plateRef.current.emissiveIntensity = t * 0.05
    }

    edgeRefs.current.forEach((material) => {
      if (material) {
        material.emissiveIntensity = 0.05 + t * 0.22
      }
    })

    if (lightRef.current) {
      lightRef.current.intensity = 10 + t * 8
    }
  })

  return (
    <group position={ALGORITHM_INSTALLATION_POSITION}>
      <mesh position={[0, 0.16, 0.06]} receiveShadow>
        <boxGeometry args={[12.8, 0.32, 1.7]} />
        <meshStandardMaterial color="#c8c3b8" />
      </mesh>
      <mesh position={[0, 0.38, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[12.2, 0.2, 1.28]} />
        <meshStandardMaterial color="#d6d2c9" />
      </mesh>
      <mesh position={[0, 0.5, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[12.4, 0.06, 1.4]} />
        <meshStandardMaterial color="#b7b1a6" />
      </mesh>
      <mesh position={[-4.2, 0.88, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.72, 0.24]} />
        <meshStandardMaterial color="#d0cbc2" />
      </mesh>
      <mesh position={[4.2, 0.88, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.72, 0.24]} />
        <meshStandardMaterial color="#d0cbc2" />
      </mesh>
      <mesh position={[0, 3.2, -0.28]} receiveShadow>
        <boxGeometry args={[12.5, 6.15, 0.18]} />
        <meshStandardMaterial color="#e8e4db" />
      </mesh>

      <mesh position={[0, 3.2, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[12.15, 5.85, 0.22]} />
        <meshStandardMaterial color="#4a4a47" />
      </mesh>
      <mesh position={[0, 3.2, 0.1]} castShadow>
        <boxGeometry args={[11.55, 5.25, 0.14]} />
        <meshStandardMaterial color="#2f2f2d" />
      </mesh>
      <mesh position={[0, 3.2, 0.16]}>
        <boxGeometry args={[11.15, 4.85, 0.06]} />
        <meshStandardMaterial color="#1b1b19" />
      </mesh>
      <mesh position={[0, 3.2, 0.19]}>
        <boxGeometry args={[10.85, 4.55, 0.03]} />
        <meshStandardMaterial
          ref={screenRef}
          color="#121210"
          emissive="#1c1c18"
          emissiveIntensity={0.06}
        />
      </mesh>

      <mesh position={[-5.46, 3.2, 0.21]}>
        <boxGeometry args={[0.02, 4.48, 0.012]} />
        <meshStandardMaterial
          ref={(material) => {
            edgeRefs.current[0] = material
          }}
          color="#b8b3a8"
          emissive="#b8b3a8"
          emissiveIntensity={0.05}
        />
      </mesh>
      <mesh position={[5.46, 3.2, 0.21]}>
        <boxGeometry args={[0.02, 4.48, 0.012]} />
        <meshStandardMaterial
          ref={(material) => {
            edgeRefs.current[1] = material
          }}
          color="#b8b3a8"
          emissive="#b8b3a8"
          emissiveIntensity={0.05}
        />
      </mesh>
      <mesh position={[0, 5.43, 0.21]}>
        <boxGeometry args={[10.94, 0.02, 0.012]} />
        <meshStandardMaterial
          ref={(material) => {
            edgeRefs.current[2] = material
          }}
          color="#b8b3a8"
          emissive="#b8b3a8"
          emissiveIntensity={0.05}
        />
      </mesh>
      <mesh position={[0, 0.97, 0.21]}>
        <boxGeometry args={[10.94, 0.02, 0.012]} />
        <meshStandardMaterial
          ref={(material) => {
            edgeRefs.current[3] = material
          }}
          color="#b8b3a8"
          emissive="#b8b3a8"
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh position={[0, 0.72, 0.52]} castShadow>
        <boxGeometry args={[1.7, 0.24, 0.04]} />
        <meshStandardMaterial color="#3c3c3a" />
      </mesh>
      <Text
        position={[0, 0.72, 0.55]}
        fontSize={0.08}
        color="#f3f0ea"
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
            color="#f4f1ea"
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
            color="#c5c0b6"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.14}
          >
            {displayed.category}
          </Text>
          <mesh position={[0, 2.95, 0.205]}>
            <boxGeometry args={[9.2, 3.15, 0.02]} />
            <meshStandardMaterial
              ref={plateRef}
              color="#e4dfd6"
              emissive="#f4f1ea"
              emissiveIntensity={0}
            />
          </mesh>
          <group
            position={[0, 3.02, 0.23]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={2.85}
          >
            <GraphVisualization
              graph={SAMPLE_GRAPH}
              nodeStates={graphStates.nodeStates}
              edgeStates={graphStates.edgeStates}
              showWeights={showWeights}
            />
          </group>
        </group>
      ) : (
        <group>
          <Text
            position={[0, 3.7, 0.22]}
            fontSize={0.46}
            color="#f4f1ea"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.16}
          >
            ALGORITHMS
          </Text>
          <Text
            position={[0, 3.05, 0.22]}
            fontSize={0.16}
            color="#c5c0b6"
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
      />
    </group>
  )
}

export default AlgorithmInstallation
