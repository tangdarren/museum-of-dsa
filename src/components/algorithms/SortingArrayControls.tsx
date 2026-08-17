type SortingArrayControlsProps = {
  disabled?: boolean
  onRandomize: () => void
  onReset: () => void
}

function SortingArrayControls({
  disabled = false,
  onRandomize,
  onReset,
}: SortingArrayControlsProps) {
  return (
    <div className="sorting-array-controls">
      <p className="algorithm-playback-speed-label">Array</p>
      <div className="sorting-array-buttons">
        <button
          type="button"
          className="algorithm-playback-button"
          onClick={onRandomize}
          disabled={disabled}
        >
          Randomize Array
        </button>
        <button
          type="button"
          className="algorithm-playback-button"
          onClick={onReset}
          disabled={disabled}
        >
          Reset Array
        </button>
      </div>
    </div>
  )
}

export default SortingArrayControls
