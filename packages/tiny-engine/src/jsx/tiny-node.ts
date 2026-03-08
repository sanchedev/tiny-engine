import { Node } from '../nodes/node.js'
import type { TinyNode } from './types.js'

export function processTinyNode(tinyNode: TinyNode): Node[] {
  if (tinyNode instanceof Node) {
    return [tinyNode]
  }
  if (Array.isArray(tinyNode)) {
    return tinyNode
      .flat(Infinity)
      .filter((node) => node instanceof Node) as Node[]
  }
  return []
}

export function getNodeFromTinyNode(node: TinyNode): Node | undefined {
  const nodes = processTinyNode(node)
  if (nodes.length !== 1) return
  return nodes[0]!
}
