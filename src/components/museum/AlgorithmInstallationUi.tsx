import AlgorithmSelector from './AlgorithmSelector'
import type {
  AlgorithmCatalogSection,
  AlgorithmId,
} from '../../types/algorithm'

type AlgorithmInstallationUiProps = {
  selectorOpen: boolean
  disabled: boolean
  previewId: AlgorithmId | null
  sections?: AlgorithmCatalogSection[]
  chooseLabel?: string
  selectorTitle?: string
  onPreview: (id: AlgorithmId | null) => void
  onOpenSelector: () => void
  onCloseSelector: () => void
  onSelectAlgorithm: (id: AlgorithmId) => void
}

function AlgorithmInstallationUi({
  selectorOpen,
  disabled,
  previewId,
  sections,
  chooseLabel = 'Choose Algorithm',
  selectorTitle,
  onPreview,
  onOpenSelector,
  onCloseSelector,
  onSelectAlgorithm,
}: AlgorithmInstallationUiProps) {
  if (selectorOpen) {
    return (
      <AlgorithmSelector
        disabled={disabled}
        previewId={previewId}
        sections={sections}
        title={selectorTitle}
        onPreview={onPreview}
        onSelect={onSelectAlgorithm}
        onClose={onCloseSelector}
      />
    )
  }

  return (
    <button
      type="button"
      className="choose-algorithm-button"
      onClick={onOpenSelector}
      disabled={disabled}
    >
      {chooseLabel}
    </button>
  )
}

export default AlgorithmInstallationUi
