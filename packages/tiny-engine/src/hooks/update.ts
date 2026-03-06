import type { TypeElements } from '../nodes/types.js'
import { pushEffect } from './context.js'

/**
 * The **`useUpdate`** hooks call `fn` when the node updates.
 * @param fn Function to call
 */
export function useUpdate<T extends keyof TypeElements = 'node'>(
  fn: (node: TypeElements[T], delta: number) => void,
) {
  pushEffect((node) => {
    node.updated.on((delta) => fn(node as TypeElements[T], delta))
  })
}
