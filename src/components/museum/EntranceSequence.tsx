import { createScope, createTimeline, utils } from 'animejs'
import { useEffect, useRef, useState } from 'react'
import EnterMuseumButton from './EnterMuseumButton'

type EntranceSequenceProps = {
  sceneReady: boolean
  fading: boolean
  enterDisabled: boolean
  onEnter: () => void
  onFaded: () => void
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function EntranceSequence({
  sceneReady,
  fading,
  enterDisabled,
  onEnter,
  onFaded,
}: EntranceSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const enterMotionRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<ReturnType<typeof createTimeline> | null>(null)
  const [enterReady, setEnterReady] = useState(false)

  useEffect(() => {
    if (!sceneReady) {
      return
    }

    const title = titleRef.current
    const subtitle = subtitleRef.current
    const enter = enterMotionRef.current

    if (!title || !subtitle || !enter) {
      return
    }

    let active = true
    const revealEnter = () => {
      if (active) {
        setEnterReady(true)
      }
    }

    if (prefersReducedMotion()) {
      utils.set(title, { opacity: 1, y: 0 })
      utils.set(subtitle, { opacity: 1, y: 0 })
      utils.set(enter, { opacity: 1, y: 0 })
      revealEnter()
      return
    }

    let scope: ReturnType<typeof createScope> | null = null
    const frame = requestAnimationFrame(() => {
      if (!active) {
        return
      }

      scope = createScope({ root: rootRef })
      scope.add(() => {
        utils.set(title, { opacity: 0, y: 8 })
        utils.set(subtitle, { opacity: 0, y: 6 })
        utils.set(enter, { opacity: 0, y: 6 })

        const timeline = createTimeline({
          defaults: { ease: 'out(3)' },
          onComplete: revealEnter,
        })

        timeline
          .add(
            title,
            {
              opacity: [0, 1],
              y: [8, 0],
              duration: 420,
            },
            0,
          )
          .add(
            subtitle,
            {
              opacity: [0, 1],
              y: [6, 0],
              duration: 360,
            },
            180,
          )
          .add(
            enter,
            {
              opacity: [0, 1],
              y: [6, 0],
              duration: 350,
            },
            480,
          )

        timelineRef.current = timeline

        return () => {
          timeline.cancel()
          timelineRef.current = null
        }
      })
    })

    return () => {
      active = false
      cancelAnimationFrame(frame)
      scope?.revert()
      timelineRef.current = null
    }
  }, [sceneReady])

  const handleSkip = () => {
    if (enterReady || !sceneReady || fading) {
      return
    }

    timelineRef.current?.complete()
  }

  return (
    <div
      ref={rootRef}
      className={fading ? 'entrance-sequence is-leaving' : 'entrance-sequence'}
    >
      {!enterReady && sceneReady ? (
        <div className="entrance-skip" onClick={handleSkip} />
      ) : null}
      <div className="entrance-copy">
        <h1 ref={titleRef} className="entrance-title">
          MUSEUM OF DSA
        </h1>
        <p ref={subtitleRef} className="entrance-subtitle">
          Data Structures & Algorithms
        </p>
      </div>
      <div
        className={
          enterReady ? 'entrance-enter' : 'entrance-enter is-pending'
        }
      >
        <div ref={enterMotionRef} className="entrance-enter-motion">
          <EnterMuseumButton
            disabled={enterDisabled || !enterReady}
            fading={fading}
            onEnter={onEnter}
            onFaded={onFaded}
          />
        </div>
      </div>
    </div>
  )
}

export default EntranceSequence
