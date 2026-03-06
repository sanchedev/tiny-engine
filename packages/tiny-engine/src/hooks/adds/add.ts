import type { Node } from '../../nodes/node.js'

export type Add<T extends Node> = (node: T) => void

export function useAdd<T extends Node>() {
  const adds: Add<T>[] = []

  const toNode = (node: T | Node) => {
    adds.forEach((add) => add(node as T))
    return node
  }

  return {
    toNode,
    adds,
  }
}
