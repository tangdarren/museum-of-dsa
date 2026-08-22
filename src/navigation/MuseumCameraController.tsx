import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { MathUtils, PerspectiveCamera, Vector3 } from 'three'
import {
  CAMERA_FOV,
  MAX_CAMERA_FOV,
  MIN_FRAMED_ASPECT,
  MUSEUM_DESTINATIONS,
  type MuseumDestination,
} from './destinations'

const DURATION = 1.75

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function framedFov(aspect: number) {
  if (!Number.isFinite(aspect) || aspect >= MIN_FRAMED_ASPECT) {
    return CAMERA_FOV
  }

  const halfHeight =
    Math.tan(MathUtils.degToRad(CAMERA_FOV) / 2) * (MIN_FRAMED_ASPECT / aspect)

  return Math.min(
    MAX_CAMERA_FOV,
    MathUtils.radToDeg(2 * Math.atan(halfHeight)),
  )
}

type MuseumCameraControllerProps = {
  destination: MuseumDestination
  onArrived: () => void
}

function MuseumCameraController({
  destination,
  onArrived,
}: MuseumCameraControllerProps) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const progress = useRef(1)
  const arrivedNotified = useRef(true)
  const fromPosition = useRef(new Vector3())
  const toPosition = useRef(new Vector3())
  const fromLookAt = useRef(new Vector3())
  const toLookAt = useRef(new Vector3())
  const lookAt = useRef(new Vector3(...MUSEUM_DESTINATIONS.entrance.lookAt))

  useLayoutEffect(() => {
    camera.position.set(...MUSEUM_DESTINATIONS.entrance.cameraPosition)
    lookAt.current.set(...MUSEUM_DESTINATIONS.entrance.lookAt)
    camera.lookAt(lookAt.current)
  }, [camera])

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera) || size.height === 0) {
      return
    }

    camera.fov = framedFov(size.width / size.height)
    camera.updateProjectionMatrix()
  }, [camera, size])

  useEffect(() => {
    fromPosition.current.copy(camera.position)
    fromLookAt.current.copy(lookAt.current)
    toPosition.current.set(...destination.cameraPosition)
    toLookAt.current.set(...destination.lookAt)

    const alreadyThere =
      camera.position.distanceTo(toPosition.current) < 0.001 &&
      lookAt.current.distanceTo(toLookAt.current) < 0.001

    if (
      alreadyThere ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      camera.position.set(...destination.cameraPosition)
      lookAt.current.set(...destination.lookAt)
      camera.lookAt(lookAt.current)
      progress.current = 1
      arrivedNotified.current = false
      return
    }

    progress.current = 0
    arrivedNotified.current = false
  }, [camera, destination])

  useFrame((_, delta) => {
    if (progress.current >= 1) {
      camera.position.set(...destination.cameraPosition)
      lookAt.current.set(...destination.lookAt)
      camera.lookAt(lookAt.current)

      if (!arrivedNotified.current) {
        arrivedNotified.current = true
        onArrived()
      }

      return
    }

    progress.current = Math.min(1, progress.current + delta / DURATION)
    const t = easeInOutCubic(progress.current)
    camera.position.lerpVectors(fromPosition.current, toPosition.current, t)
    lookAt.current.lerpVectors(fromLookAt.current, toLookAt.current, t)
    camera.lookAt(lookAt.current)

    if (progress.current >= 1 && !arrivedNotified.current) {
      arrivedNotified.current = true
      onArrived()
    }
  })

  return null
}

export default MuseumCameraController
