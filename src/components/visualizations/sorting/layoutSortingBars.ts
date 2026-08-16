export const SORT_VISUALIZATION_WIDTH = 1.36
export const SORT_BAR_MAX_HEIGHT = 0.52
export const SORT_BAR_MIN_HEIGHT = 0.046
export const SORT_BAR_DEPTH = 0.08

export function layoutSortingBars(count: number) {
  if (count <= 0) {
    return {
      width: 0,
      depth: SORT_BAR_DEPTH,
      gap: 0,
      totalWidth: 0,
      startX: 0,
    }
  }

  const spacing = SORT_VISUALIZATION_WIDTH / count
  const width = Math.min(0.14, Math.max(0.05, spacing * 0.7))
  const gap = Math.max(0.012, spacing - width)
  const totalWidth = count * width + (count - 1) * gap

  return {
    width,
    depth: SORT_BAR_DEPTH,
    gap,
    totalWidth,
    startX: -totalWidth / 2 + width / 2,
  }
}

export function sortingBarX(startX: number, width: number, gap: number, index: number) {
  return startX + index * (width + gap)
}

export function sortingBarHeight(value: number, maxValue: number) {
  return Math.max(SORT_BAR_MIN_HEIGHT, (Math.abs(value) / maxValue) * SORT_BAR_MAX_HEIGHT)
}
