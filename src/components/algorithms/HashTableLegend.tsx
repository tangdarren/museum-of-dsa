import {
  hashTableBucketStyle,
  hashTableEntryStyle,
} from '../../theme/palette'

const HASH_TABLE_LEGEND_ITEMS = [
  { key: 'bucket', label: 'Active bucket', color: hashTableBucketStyle.active.color },
  { key: 'collision', label: 'Collision', color: hashTableBucketStyle.collision.color },
  { key: 'active', label: 'Inspecting', color: hashTableEntryStyle.active.color },
  { key: 'found', label: 'Found', color: hashTableEntryStyle.found.color },
  { key: 'inserting', label: 'Inserting', color: hashTableEntryStyle.inserting.color },
  { key: 'deleting', label: 'Deleting', color: hashTableEntryStyle.deleting.color },
] as const

function HashTableLegend() {
  return (
    <ul className="hash-table-legend" aria-label="Hash table state legend">
      {HASH_TABLE_LEGEND_ITEMS.map((item) => (
        <li key={item.key}>
          <span
            className="hash-table-legend-swatch"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}

export default HashTableLegend
