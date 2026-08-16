import {
  createDrawable,
  createScope,
  createTimeline,
  splitText,
  stagger,
  utils,
} from 'animejs'
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
  const accentRef = useRef<SVGSVGElement>(null)
  const enterMotionRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<ReturnType<typeof createTimeline> | null>(null)
  const [enterReady, setEnterReady] = useState(false)

  useEffect(() => {
    if (!sceneReady) {
      return
    }

    const title = titleRef.current
    const subtitle = subtitleRef.current
    const accent = accentRef.current
    const enter = enterMotionRef.current

    if (!title || !subtitle || !accent || !enter) {
      return
    }

    let active = true
    const revealEnter = () => {
      if (active) {
        setEnterReady(true)
      }
    }

    const drawables = createDrawable(accent.querySelectorAll('path'))

    if (prefersReducedMotion()) {
      utils.set(title, { opacity: 1 })
      utils.set(subtitle, { opacity: 1, y: 0 })
      utils.set(accent, { opacity: 0.26 })
      utils.set(enter, { opacity: 1, y: 0 })
      utils.set(drawables, { draw: '0 1' })
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
        const split = splitText(title, {
          chars: true,
          includeSpaces: true,
        })

        utils.set(title, { opacity: 1 })
        utils.set(split.chars, { opacity: 0, y: 10, scale: 0.975 })
        utils.set(subtitle, { opacity: 0, y: 8 })
        utils.set(accent, { opacity: 0 })
        utils.set(enter, { opacity: 0, y: 6 })
        utils.set(drawables, { draw: '0 0' })

        const timeline = createTimeline({
          defaults: { ease: 'out(3)' },
          onComplete: revealEnter,
        })

        timeline
          .add(
            split.chars,
            {
              opacity: [0, 1],
              y: [10, 0],
              scale: [0.975, 1],
              duration: 500,
              delay: stagger(32),
            },
            0,
          )
          .add(
            subtitle,
            {
              opacity: [0, 1],
              y: [8, 0],
              duration: 400,
            },
            680,
          )
          .add(
            accent,
            {
              opacity: [0, 0.88],
              duration: 200,
              ease: 'out(2)',
            },
            880,
          )
          .add(
            drawables,
            {
              draw: ['0 0', '0 1'],
              duration: 500,
              ease: 'inOut(2)',
              delay: stagger(32),
            },
            900,
          )
          .add(
            enter,
            {
              opacity: [0, 1],
              y: [6, 0],
              duration: 360,
            },
            1280,
          )
          .add(
            accent,
            {
              opacity: 0.26,
              duration: 280,
              ease: 'inOut(2)',
            },
            1480,
          )

        timelineRef.current = timeline

        return () => {
          timeline.cancel()
          split.revert()
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
      <svg
        ref={accentRef}
        className="entrance-accent"
        viewBox="0 0 200 260"
        fill="none"
        aria-hidden="true"
      >
        <path d="M52 46 H148" />
        <path d="M40 72 V46 H66" />
        <path d="M160 72 V46 H134" />
        <path d="M40 188 V214 H66" />
        <path d="M160 188 V214 H134" />
        <path d="M40 130 H52" />
        <path d="M160 130 H148" />
      </svg>
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
