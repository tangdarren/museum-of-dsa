import AlgorithmSelector from './AlgorithmSelector'
import type { AlgorithmId } from '../../types/algorithm'

type AlgorithmInstallationUiProps = {
  selectorOpen: boolean
  disabled: boolean
  previewId: AlgorithmId | null
  onPreview: (id: AlgorithmId | null) => void
  onOpenSelector: () => void
  onCloseSelector: () => void
  onSelectAlgorithm: (id: AlgorithmId) => void
}

function AlgorithmInstallationUi({
  selectorOpen,
  disabled,
  previewId,
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
      Choose Algorithm
    </button>
  )
}

export default AlgorithmInstallationUi
