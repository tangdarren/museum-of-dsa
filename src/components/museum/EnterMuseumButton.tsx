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
  return (
    <button
      type="button"
      className={
        fading ? 'enter-museum-button is-fading' : 'enter-museum-button'
      }
      disabled={disabled}
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
