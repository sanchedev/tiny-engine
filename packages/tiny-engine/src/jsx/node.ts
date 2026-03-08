import type { Node } from '../nodes/node.js'
import { Nodes, type NodesOptions, type NodeToOptions } from '../nodes/types.js'
import {
  applyToNode,
  type NodeIntrinsicElements,
} from './intrinsic-elements.js'

export function getNodeFromKey<T extends keyof typeof Nodes>(
  type: T,
  props: NodeIntrinsicElements[T],
): (typeof Nodes)[T]['prototype'] {
  const node = getNodeFromClass(Nodes[type], props as NodesOptions[T])
  return applyToNode(node, props)
}

export function getNodeFromComp<T extends {}, K extends Node>(
  func: (props: T) => K,
  props: T,
): K {
  return func(props)
}

export function getNodeFromClass<T extends typeof Node>(
  nodeClass: T,
  props: NodeToOptions<T>,
): T['prototype'] {
  return new nodeClass(props)
}
