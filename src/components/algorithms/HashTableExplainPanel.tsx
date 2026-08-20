import type {
  AlgorithmHashTableSnapshot,
  AlgorithmInspection,
} from '../../types/algorithmStep'
import { describeHashTableCaption } from '../visualizations/hashTable/describeHashTableCaption'

type HashTableExplainPanelProps = {
  snapshot: AlgorithmHashTableSnapshot | null
  description?: string
  inspection?: AlgorithmInspection | null
}

function HashTableExplainPanel({
  snapshot,
  description,
  inspection,
}: HashTableExplainPanelProps) {
  const caption = describeHashTableCaption(snapshot, description)

  if (!caption) {
    return null
  }

  const meta = [
    caption.keyLabel ? `Key ${caption.keyLabel}` : null,
    caption.bucketLabel ? `Bucket ${caption.bucketLabel}` : null,
    caption.collision ? 'Collision detected' : null,
  ].filter((value): value is string => Boolean(value))

  return (
    <aside className="hash-table-explain" aria-label="Hash table step">
      <p className="hash-table-explain-title">{caption.title}</p>
      <p className="hash-table-explain-detail">{caption.detail}</p>
      {meta.length > 0 ? (
        <p className="hash-table-explain-meta">{meta.join(' · ')}</p>
      ) : null}
      {inspection ? (
        <div className="hash-table-explain-inspection">
          <p className="hash-table-explain-inspection-title">{inspection.title}</p>
          {inspection.lines.map((line) => (
            <p key={line} className="hash-table-explain-inspection-line">
              {line}
            </p>
          ))}
        </div>
      ) : null}
    </aside>
  )
}

export default HashTableExplainPanel
