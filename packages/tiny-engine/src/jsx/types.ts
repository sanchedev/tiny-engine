import type { Node } from '../nodes/node.js'
import type { NodeTypes } from '../nodes/types.js'
import type { NodeIntrinsicElements } from './cases/intrinsic-elements.js'

export type TinyNode = undefined | null | Node | Node[] | TinyNode[]

export type WithChildren<T> = Omit<T, 'children'> & {
  children?: TinyNode
}

export type TinyType =
  | keyof JSX.IntrinsicElements
  | typeof Node
  | ((props: any) => TinyNode)

// JSX Function
export type JSXProps<T extends TinyType> = T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : T extends (props: infer P) => TinyNode
    ? P
    : T extends new (props: infer P) => Node
      ? P
      : never

export type JSXReturn<T extends TinyType> =
  T extends keyof JSX.IntrinsicElements
    ? T extends keyof NodeTypes
      ? NodeTypes[T]
      : null
    : T extends (props: any) => TinyNode
      ? TinyNode
      : T extends new (props: any) => Node
        ? Node
        : never

// JSX Declaration
declare global {
  namespace JSX {
    type Element = TinyNode

    interface IntrinsicElements extends NodeIntrinsicElements {}

    type Nodes = NodeTypes
  }
}
