type TreeSearchControlsProps = {
  disabled?: boolean
  targetValue: number
  presentValues: number[]
  missingValues: number[]
  onSelectTarget: (value: number) => void
}

function TreeSearchControls({
  disabled = false,
  targetValue,
  presentValues,
  missingValues,
  onSelectTarget,
}: TreeSearchControlsProps) {
  return (
    <div className="tree-search-controls">
      <p className="algorithm-playback-speed-label">Search for</p>
      <div
        className="tree-search-buttons"
        role="group"
        aria-label="Values in the tree"
      >
        {presentValues.map((value) => (
          <button
            key={value}
            type="button"
            className={
              targetValue === value
                ? 'algorithm-playback-button is-speed is-active'
                : 'algorithm-playback-button is-speed'
            }
            onClick={() => onSelectTarget(value)}
            disabled={disabled}
            aria-pressed={targetValue === value}
          >
            {value}
          </button>
        ))}
      </div>
      {missingValues.length > 0 ? (
        <>
          <p className="algorithm-playback-speed-label">Not in the tree</p>
          <div
            className="tree-search-buttons"
            role="group"
            aria-label="Values not in the tree"
          >
            {missingValues.map((value) => (
              <button
                key={value}
                type="button"
                className={
                  targetValue === value
                    ? 'algorithm-playback-button is-speed is-active'
                    : 'algorithm-playback-button is-speed'
                }
                onClick={() => onSelectTarget(value)}
                disabled={disabled}
                aria-pressed={targetValue === value}
              >
                {value}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default TreeSearchControls
