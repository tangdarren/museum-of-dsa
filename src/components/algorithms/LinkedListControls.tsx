import type { LinkedListMutationPosition } from '../../types/linkedList'
import { linkedListMutationPositionKey } from '../../data/sampleLinkedList'

export type LinkedListControlMode = 'search' | 'insert' | 'delete'

export type LinkedListSearchControls = {
  targetValue: number
  presentValues: number[]
  missingValues: number[]
  onSelectTarget: (value: number) => void
}

export type LinkedListInsertControls = {
  value: number
  values: number[]
  position: LinkedListMutationPosition
  positions: { label: string; position: LinkedListMutationPosition }[]
  onSelectValue: (value: number) => void
  onSelectPosition: (position: LinkedListMutationPosition) => void
}

export type LinkedListDeleteControls = {
  position: LinkedListMutationPosition
  positions: { label: string; position: LinkedListMutationPosition }[]
  onSelectPosition: (position: LinkedListMutationPosition) => void
}

type LinkedListControlsProps = {
  disabled?: boolean
  mode: LinkedListControlMode
  search?: LinkedListSearchControls
  insert?: LinkedListInsertControls
  delete?: LinkedListDeleteControls
}

function LinkedListControls({
  disabled = false,
  mode,
  search,
  insert,
  delete: deleteControls,
}: LinkedListControlsProps) {
  return (
    <div className="linked-list-controls">
      {mode === 'search' && search ? (
        <>
          <p className="algorithm-playback-speed-label">Search for</p>
          <div
            className="linked-list-buttons"
            role="group"
            aria-label="Values in the list"
          >
            {search.presentValues.map((value) => (
              <button
                key={value}
                type="button"
                className={
                  search.targetValue === value
                    ? 'algorithm-playback-button is-speed is-active'
                    : 'algorithm-playback-button is-speed'
                }
                onClick={() => search.onSelectTarget(value)}
                disabled={disabled}
                aria-pressed={search.targetValue === value}
              >
                {value}
              </button>
            ))}
          </div>
          {search.missingValues.length > 0 ? (
            <>
              <p className="algorithm-playback-speed-label">Not in the list</p>
              <div
                className="linked-list-buttons"
                role="group"
                aria-label="Values not in the list"
              >
                {search.missingValues.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      search.targetValue === value
                        ? 'algorithm-playback-button is-speed is-active'
                        : 'algorithm-playback-button is-speed'
                    }
                    onClick={() => search.onSelectTarget(value)}
                    disabled={disabled}
                    aria-pressed={search.targetValue === value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : null}
      {mode === 'insert' && insert ? (
        <>
          <p className="algorithm-playback-speed-label">Insert value</p>
          <div
            className="linked-list-buttons"
            role="group"
            aria-label="Value to insert"
          >
            {insert.values.map((value) => (
              <button
                key={value}
                type="button"
                className={
                  insert.value === value
                    ? 'algorithm-playback-button is-speed is-active'
                    : 'algorithm-playback-button is-speed'
                }
                onClick={() => insert.onSelectValue(value)}
                disabled={disabled}
                aria-pressed={insert.value === value}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="algorithm-playback-speed-label">Location</p>
          <div
            className="linked-list-buttons"
            role="group"
            aria-label="Insert location"
          >
            {insert.positions.map((option) => {
              const selected =
                linkedListMutationPositionKey(insert.position) ===
                linkedListMutationPositionKey(option.position)

              return (
                <button
                  key={option.label}
                  type="button"
                  className={
                    selected
                      ? 'algorithm-playback-button is-speed is-active'
                      : 'algorithm-playback-button is-speed'
                  }
                  onClick={() => insert.onSelectPosition(option.position)}
                  disabled={disabled}
                  aria-pressed={selected}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </>
      ) : null}
      {mode === 'delete' && deleteControls ? (
        <>
          <p className="algorithm-playback-speed-label">Delete location</p>
          <div
            className="linked-list-buttons"
            role="group"
            aria-label="Delete location"
          >
            {deleteControls.positions.map((option) => {
              const selected =
                linkedListMutationPositionKey(deleteControls.position) ===
                linkedListMutationPositionKey(option.position)

              return (
                <button
                  key={option.label}
                  type="button"
                  className={
                    selected
                      ? 'algorithm-playback-button is-speed is-active'
                      : 'algorithm-playback-button is-speed'
                  }
                  onClick={() =>
                    deleteControls.onSelectPosition(option.position)
                  }
                  disabled={disabled}
                  aria-pressed={selected}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default LinkedListControls
