import type { Node } from '../nodes/node.js'
import type { TinyNode } from './types.js'

export function processChildren(children: TinyNode): Node[] {
  if (children == null) {
    return []
  }
  if (Array.isArray(children)) {
    return children
  }
  return [children]
}
