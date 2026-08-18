import type {
  AlgorithmCatalogEntry,
  AlgorithmCategory,
  AlgorithmId,
} from '../../types/algorithm'

type AlgorithmGalleryUiProps = {
  category: AlgorithmCategory
  entries: AlgorithmCatalogEntry[]
  disabled?: boolean
  previewId: AlgorithmId | null
  onPreview: (id: AlgorithmId | null) => void
  onSelect: (id: AlgorithmId) => void
}

function AlgorithmGalleryUi({
  category,
  entries,
  disabled = false,
  previewId,
  onPreview,
  onSelect,
}: AlgorithmGalleryUiProps) {
  return (
    <div
      className="algorithm-gallery-ui"
      aria-label={`${category} gallery`}
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
      <p className="algorithm-selector-kicker">Gallery</p>
      <h2 className="algorithm-gallery-title">{category}</h2>
      <div className="algorithm-selector-list">
        {entries.map((entry) =>
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
    </div>
  )
}

export default AlgorithmGalleryUi
