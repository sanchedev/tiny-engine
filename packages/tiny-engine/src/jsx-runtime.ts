import { finishHooks, startHooks } from './hooks/context.js'
import { Nodes, type NodeTypes } from './nodes/types.js'
import { Node } from './nodes/index.js'
import {
  getNodeFromClass,
  getNodeFromComp,
  getNodeFromKey,
} from './jsx/node.js'
import type { NodeIntrinsicElements } from './jsx/intrinsic-elements.js'
import type { TinyNode } from './jsx/types.js'
import { processChildren } from './jsx/children.js'

export type TinyComponent =
  | keyof JSX.IntrinsicElements
  | typeof Node
  | ((props: any) => TinyNode)

type PropsOf<T> = T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : T extends (props: infer P) => TinyNode
    ? P
    : T extends new (props: infer P) => Node
      ? Omit<P, 'children'>
      : never

type ReturnTypeOf<T> = T extends keyof JSX.IntrinsicElements
  ? (typeof Nodes)[T]['prototype']
  : T extends (props: any) => infer R
    ? R
    : T extends new (props: any) => infer R
      ? R
      : never

export function jsx<T extends TinyComponent>(
  type: T,
  props: PropsOf<T>,
): ReturnTypeOf<T> {
  const { children } = props

  const safeChildren =
    children == null
      ? undefined
      : Array.isArray(children)
        ? (children.flat(Infinity) as Node[])
        : ([children] as Node[])

  const newProps = { ...props, children: safeChildren }

  let node: ReturnTypeOf<T>

  startHooks()

  if (typeof type === 'string') {
    // Type is a string
    if (!(type in Nodes))
      throw new Error(`Node with name ${type} does not exist.`)
    // Type is a key of nodes

    node = getNodeFromKey(type, newProps) as ReturnTypeOf<T>
  } else if (typeof type === 'function') {
    // Type is a class or a function
    if (
      'prototype' in type &&
      Object.getOwnPropertyDescriptor(type, 'prototype')?.writable === false &&
      'nodeName' in type &&
      (type.prototype instanceof Node || type.prototype === Node.prototype)
    ) {
      // Type is a node class
      node = getNodeFromClass(type as typeof Node, props) as ReturnTypeOf<T>
    } else {
      // Type is a function
      node = getNodeFromComp(
        type as (props: any) => Node,
        props,
      ) as ReturnTypeOf<T>
    }
  } else {
    throw new Error('Type incompatible')
  }

  if (!Array.isArray(node) && !(node instanceof Node)) {
    throw new Error('The function or class shoulds return a TinyNode.')
  }

  finishHooks(node)

  return node
}

export const jsxs = jsx
export const Fragment = ({ children }: { children: TinyNode }) =>
  processChildren(children)

declare global {
  namespace JSX {
    type Element = TinyNode

    interface IntrinsicElements extends NodeIntrinsicElements {}

    type Nodes = NodeTypes
  }
}
