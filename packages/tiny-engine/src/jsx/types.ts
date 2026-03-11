import type { Event } from '../events/event.js'
import type { Node } from '../nodes/node.js'
import type { NodeInstances, NodeName, NodesOptions } from '../nodes/types.js'

export namespace Tiny {
  export type Type = keyof JSX.IntrinsicElements | ((props: any) => Node)

  export interface Element<T extends Type = any> {
    type: T
    props: PropsOf<T>
    // key: string | null
  }

  export type Node =
    | Element<any>
    | string
    | number
    | null
    | undefined
    | Iterable<Node>

  export type IntrinsicElements = {
    [P in NodeName]: IntrinsicElement<P>
  }

  export type WithChildren<T = {}> = Omit<T, 'children'> & {
    children?: Node
  }

  export type PropsOf<T extends Type> = T extends keyof IntrinsicElements
    ? IntrinsicElements[T]
    : T extends (props: infer P) => Node
      ? P
      : never
}

// Intrinsic Elements
export type IntrinsicElement<T extends NodeName = 'node'> = {
  /** The **`use`** property can be user for `useNode` hook.
   * @example
   * ```tsx
   * const sprite = useNode()
   *
   * return <sprite use={sprite} />
   * ```
   */
  use?: NodeInstances[T]
} & RecordOfEvents<NodeInstances[T]> &
  Tiny.WithChildren<NodesOptions[T]>

// Event
type RecordOfEvents<T extends Node = Node> = {
  [P in keyof T as NodeEvent<T, P> extends undefined
    ? never
    : EventName<NonNullable<NodeEvent<T, P>>['baseName']>]?: NonNullable<
    NodeEvent<T, P>
  >['exampleFun']
}

type NodeEvent<T extends Node, K extends keyof T> =
  T[K] extends Event<any[], string> ? T[K] : undefined

type EventName<T extends string> = `on${Capitalize<T>}`

// JSX Declaration
declare global {
  namespace JSX {
    type Element = Tiny.Element

    interface IntrinsicElements extends Tiny.IntrinsicElements {}

    type Nodes = NodeInstances
  }
}
