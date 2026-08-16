import type { Exhibit } from '../../types/exhibit'

type ExhibitOverlayProps = {
  exhibit: Exhibit
  onBackToWing: () => void
  disabled?: boolean
}

function ExhibitOverlay({
  exhibit,
  onBackToWing,
  disabled = false,
}: ExhibitOverlayProps) {
  return (
    <aside className="exhibit-overlay">
      <h2>{exhibit.title}</h2>
      <p>{exhibit.description}</p>
      <button
        type="button"
        className="museum-button"
        onClick={onBackToWing}
        disabled={disabled}
      >
        ← Back to Wing
      </button>
    </aside>
  )
}

export default ExhibitOverlay
