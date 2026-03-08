import { Node } from '../nodes/node.js'
import type { TinyNode } from './types.js'

export function processTinyNode(tinyNode: TinyNode): Node[] {
  if (tinyNode == null) {
    return []
  }
  if (Array.isArray(tinyNode)) {
    return tinyNode
      .flat(Infinity)
      .filter((node) => node instanceof Node) as Node[]
  }
  return [tinyNode]
}

export function getNodeFromTinyNode(node: TinyNode): Node | undefined {
  const nodes = processTinyNode(node)
  if (nodes.length !== 1) return
  return nodes[0]!
}
