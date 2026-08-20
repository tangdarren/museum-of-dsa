import type {
  AlgorithmCatalogSection,
  AlgorithmId,
} from '../../types/algorithm'
import { ALGORITHM_SECTIONS } from '../../data/algorithms'

type AlgorithmSelectorProps = {
  disabled?: boolean
  previewId: AlgorithmId | null
  sections?: AlgorithmCatalogSection[]
  title?: string
  onPreview: (id: AlgorithmId | null) => void
  onSelect: (id: AlgorithmId) => void
  onClose: () => void
}

function AlgorithmSelector({
  disabled = false,
  previewId,
  sections = ALGORITHM_SECTIONS,
  title = 'Choose algorithm',
  onPreview,
  onSelect,
  onClose,
}: AlgorithmSelectorProps) {
  return (
    <div
      className="algorithm-selector"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) {
          onPreview(null)
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onPreview(null)
        }
      }}
    >
      <div className="algorithm-selector-header">
        <p className="algorithm-selector-kicker">Collection</p>
        <button
          type="button"
          className="algorithm-selector-close"
          onClick={onClose}
          disabled={disabled}
        >
          Close
        </button>
      </div>
      {sections.map((section) => (
        <section key={section.category} className="algorithm-selector-section">
          <h3>{section.category}</h3>
          <div className="algorithm-selector-list">
            {section.entries.map((entry) =>
              entry.available ? (
                <button
                  key={entry.id}
                  type="button"
                  className={
                    previewId === entry.id
                      ? 'algorithm-option is-previewed'
                      : 'algorithm-option'
                  }
                  onClick={() => onSelect(entry.id)}
                  onMouseEnter={() => onPreview(entry.id)}
                  onFocus={() => onPreview(entry.id)}
                  disabled={disabled}
                >
                  {entry.title}
                </button>
              ) : (
                <button
                  key={entry.id}
                  type="button"
                  className="algorithm-option is-unavailable"
                  disabled
                >
                  <span>{entry.title}</span>
                  <span>Coming Soon</span>
                </button>
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

export default AlgorithmSelector
