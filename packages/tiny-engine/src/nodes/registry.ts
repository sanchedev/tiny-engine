import type { Node } from './node.js'
import type { NodeClasses, NodeToOptions } from './types.js'

export const Nodes: NodeClasses = {} as NodeClasses

export function getNode<T extends keyof NodeClasses>(
  nodeName: T,
  options: NodeToOptions<NodeClasses[T]>,
) {
  return getNodeFromClass(Nodes[nodeName], options)
}

export function getNodeFromClass<T extends typeof Node>(
  nodeClass: T,
  props: NodeToOptions<T>,
): T['prototype'] {
  return new nodeClass(props)
}

export function registerNode<T extends keyof NodeClasses>(
  nodeName: T,
  nodeClass: NodeClasses[T],
) {
  Nodes[nodeName] = nodeClass
}
