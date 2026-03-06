import type { TypeElements } from '../nodes/types.js'
import { pushEffect } from './context.js'

/**
 * The **`useStart`** hooks call `fn` when the node starts.
 * @param fn Function to call
 */
export function useStart<T extends keyof TypeElements = 'node'>(
  fn: (node: TypeElements[T]) => void,
) {
  pushEffect((node) => {
    node.started.on(() => fn(node as TypeElements[T]))
  })
}
