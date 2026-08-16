export function createPriorityQueue<T>(compare: (left: T, right: T) => number) {
  const items: T[] = []

  return {
    push(item: T) {
      items.push(item)
    },
    pop(): T | undefined {
      if (items.length === 0) {
        return undefined
      }

      let best = 0

      for (let index = 1; index < items.length; index += 1) {
        if (compare(items[index], items[best]) < 0) {
          best = index
        }
      }

      const [item] = items.splice(best, 1)
      return item
    },
    isEmpty() {
      return items.length === 0
    },
  }
}
