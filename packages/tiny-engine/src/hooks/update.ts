import type { TypeElements } from '../nodes/types.js'
import { pushEffect } from './context.js'

export function useUpdate<T extends keyof TypeElements = 'node'>(
  fn: (node: TypeElements[T], delta: number) => void,
) {
  pushEffect((node) => {
    node.updated.on((delta) => fn(node as TypeElements[T], delta))
  })
}
