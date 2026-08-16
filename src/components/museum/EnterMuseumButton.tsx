import { useEffect } from 'react'

type EnterMuseumButtonProps = {
  disabled: boolean
  fading: boolean
  onEnter: () => void
  onFaded: () => void
}

function EnterMuseumButton({
  disabled,
  fading,
  onEnter,
  onFaded,
}: EnterMuseumButtonProps) {
  useEffect(() => {
    if (
      fading &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      onFaded()
    }
  }, [fading, onFaded])

  return (
    <button
      type="button"
      className={
        fading ? 'enter-museum-button is-fading' : 'enter-museum-button'
      }
      disabled={disabled}
      aria-label="Enter the museum"
      onClick={onEnter}
      onTransitionEnd={(event) => {
        if (event.propertyName === 'opacity' && fading) {
          onFaded()
        }
      }}
    >
      Enter
    </button>
  )
}

export default EnterMuseumButton
