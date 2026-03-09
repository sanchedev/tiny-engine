import { Node } from '../../nodes/node.js'
import { getNodeFromClass } from '../../nodes/registry.js'
import { type NodeToOptions } from '../../nodes/types.js'

export function isNodeClass(obj: any): obj is typeof Node {
  if (typeof obj !== 'function') return false
  if (Object.getOwnPropertyDescriptor(obj, 'prototype')?.writable !== false)
    return false
  if (!(obj.prototype instanceof Node) && obj.prototype !== Node.prototype)
    return false

  return true
}

export function getNodeFromNodeClass<T extends typeof Node>(
  nodeClass: T,
  options: NodeToOptions<T>,
) {
  return getNodeFromClass(nodeClass, options)
}
