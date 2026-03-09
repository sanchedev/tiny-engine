import { InvalidNodeInstanceError } from '../errors/node.js'
import type { Node } from './node.js'
import { Nodes } from './registry.js'
import type { NodeClasses } from './types.js'

const nodeNamesMap = new Map<Node, keyof typeof Nodes>()

// TODO: Arregla esto añadiendo un map para cache y usar object get property of
export function getNodeName<T extends keyof NodeClasses>(
  node: NodeClasses[T]['prototype'],
): T {
  const nodePrototype = Object.getPrototypeOf(
    node,
  ) as NodeClasses[T]['prototype']
  const name = nodeNamesMap.get(nodePrototype)
  if (name != null) return name as T

  for (const key in Nodes) {
    if (!Object.hasOwn(Nodes, key)) continue

    const prototype = Nodes[key as keyof typeof Nodes].prototype

    if (nodeNamesMap.has(prototype)) continue

    nodeNamesMap.set(prototype, key as keyof typeof Nodes)
    if (prototype === nodePrototype) return key as T
  }

  throw new InvalidNodeInstanceError(node)
}
