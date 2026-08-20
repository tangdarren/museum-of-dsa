import {
  HASH_TABLE_INSERT_SUGGESTIONS,
  HASH_TABLE_KEY_MAX_LENGTH,
} from '../../data/sampleHashTable'

export type HashTableControlMode = 'search' | 'insert' | 'delete'

type HashTableControlsProps = {
  disabled?: boolean
  mode: HashTableControlMode
  entryKey: string
  entryValue: string
  keyError?: string | null
  presentKeys: string[]
  missingKeys?: string[]
  onKeyChange: (key: string) => void
  onValueChange: (value: string) => void
  onSelectInsertPair?: (pair: { key: string; value: string }) => void
  onResetTable: () => void
}

function HashTableControls({
  disabled = false,
  mode,
  entryKey,
  entryValue,
  keyError = null,
  presentKeys,
  missingKeys = [],
  onKeyChange,
  onValueChange,
  onSelectInsertPair,
  onResetTable,
}: HashTableControlsProps) {
  const keyInvalid = Boolean(keyError)

  return (
    <form
      className="hash-table-controls"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <p className="algorithm-playback-speed-label">
        {mode === 'insert' ? 'Insert' : mode === 'search' ? 'Search' : 'Delete'}
      </p>
      <label className="hash-table-field" htmlFor="hash-table-key">
        <span className="algorithm-playback-speed-label">Key</span>
        <input
          id="hash-table-key"
          className={
            keyInvalid ? 'hash-table-input is-invalid' : 'hash-table-input'
          }
          value={entryKey}
          onChange={(event) =>
            onKeyChange(event.target.value.slice(0, HASH_TABLE_KEY_MAX_LENGTH))
          }
          maxLength={HASH_TABLE_KEY_MAX_LENGTH}
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          aria-invalid={keyInvalid}
          aria-describedby={keyInvalid ? 'hash-table-key-error' : undefined}
        />
      </label>
      {keyError ? (
        <p id="hash-table-key-error" className="hash-table-error" role="alert">
          {keyError}
        </p>
      ) : null}
      {mode === 'insert' ? (
        <label className="hash-table-field" htmlFor="hash-table-value">
          <span className="algorithm-playback-speed-label">Value</span>
          <input
            id="hash-table-value"
            className="hash-table-input"
            value={entryValue}
            onChange={(event) =>
              onValueChange(
                event.target.value.slice(0, HASH_TABLE_KEY_MAX_LENGTH),
              )
            }
            maxLength={HASH_TABLE_KEY_MAX_LENGTH}
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
          />
        </label>
      ) : null}
      {mode === 'insert' && onSelectInsertPair ? (
        <>
          <p className="algorithm-playback-speed-label">Try</p>
          <div
            className="hash-table-buttons"
            role="group"
            aria-label="Suggested insert pairs"
          >
            {HASH_TABLE_INSERT_SUGGESTIONS.map((pair) => {
              const selected =
                entryKey === pair.key && entryValue === pair.value
              const label =
                pair.key === 'elk'
                  ? 'New bucket'
                  : pair.key === 'emu'
                    ? 'Collision'
                    : 'Update key'

              return (
                <button
                  key={`${pair.key}:${pair.value}`}
                  type="button"
                  className={
                    selected
                      ? 'algorithm-playback-button is-speed is-active'
                      : 'algorithm-playback-button is-speed'
                  }
                  onClick={() => onSelectInsertPair(pair)}
                  disabled={disabled}
                  aria-pressed={selected}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </>
      ) : null}
      {mode !== 'insert' && presentKeys.length > 0 ? (
        <>
          <p className="algorithm-playback-speed-label">In the table</p>
          <div
            className="hash-table-buttons"
            role="group"
            aria-label="Keys in the table"
          >
            {presentKeys.map((key) => (
              <button
                key={key}
                type="button"
                className={
                  entryKey === key
                    ? 'algorithm-playback-button is-speed is-active'
                    : 'algorithm-playback-button is-speed'
                }
                onClick={() => onKeyChange(key)}
                disabled={disabled}
                aria-pressed={entryKey === key}
              >
                {key}
              </button>
            ))}
          </div>
        </>
      ) : null}
      {mode === 'search' && missingKeys.length > 0 ? (
        <>
          <p className="algorithm-playback-speed-label">Not in the table</p>
          <div
            className="hash-table-buttons"
            role="group"
            aria-label="Keys not in the table"
          >
            {missingKeys.map((key) => (
              <button
                key={key}
                type="button"
                className={
                  entryKey === key
                    ? 'algorithm-playback-button is-speed is-active'
                    : 'algorithm-playback-button is-speed'
                }
                onClick={() => onKeyChange(key)}
                disabled={disabled}
                aria-pressed={entryKey === key}
              >
                {key}
              </button>
            ))}
          </div>
        </>
      ) : null}
      <div className="hash-table-buttons">
        <button
          type="button"
          className="algorithm-playback-button"
          onClick={onResetTable}
          disabled={disabled}
        >
          Reset Table
        </button>
      </div>
      <p className="hash-table-controls-note">
        Average insert, search, and delete are O(1). A collision means this
        bucket already has entries, so the chain is scanned and the operation
        can take longer.
      </p>
    </form>
  )
}

export default HashTableControls
