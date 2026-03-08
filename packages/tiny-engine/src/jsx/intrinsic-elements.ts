import { Node, type NodeOptions } from '../nodes/node.js'
import type { NodeTypes, NodesOptions } from '../nodes/types.js'
import { NODE_REF, type UsedNode } from '../hooks/node.js'
import { Event } from '../events/event.js'

export type NodeElement<T extends Node = Node> = {
  /** The **`use`** property can be user for `useNode` hook.
   * @example
   * ```tsx
   * const sprite = useNode()
   *
   * return <sprite use={sprite} />
   * ```
   */
  use?: T
} & RecordOfEvents<T>

export function applyToNode<T extends Node>(node: T, opts: NodeElement<T>): T {
  if (opts.use) {
    const used = opts.use as T & { [NODE_REF]?: UsedNode<T> }
    if (used[NODE_REF] && 'node' in used[NODE_REF]) {
      used[NODE_REF].node = node
    } else {
      throw new Error('Only usedsNodes can be set in use property.')
    }
  }

  applyEvents(node, opts)

  return node
}

function applyEvents<T extends Node>(node: T, opts: NodeElement<T>) {
  const events: Map<string, Event<any[], string>> = new Map()

  for (const key in node) {
    if (!Object.hasOwn(node, key)) continue

    const el = node[key]

    if (el instanceof Event) {
      const k = `on${el.baseName[0].toUpperCase()}${el.baseName.slice(1)}`
      events.set(k, el)
    }
  }

  for (const key in opts) {
    if (!Object.hasOwn(opts, key)) continue

    const fn = opts[key as keyof typeof opts]

    if (typeof fn !== 'function') continue

    const ev = events.get(key)

    if (ev == null) continue

    ev.on(fn as (typeof ev)['exampleFun'])
  }
}

export type NodeIntrinsicElements = {
  [P in keyof NodeTypes]: WithChildren<NodesOptions[P]> &
    NodeElement<NodeTypes[P]>
}

type Children = undefined | Node | Node[]

type WithChildren<T extends NodeOptions> = Omit<T, 'children'> & {
  children?: Children
}

// Event

type EventName<T extends string> = `on${Capitalize<T>}`

type NodeEvent<T extends Node, K extends keyof T> =
  T[K] extends Event<any[], string> ? T[K] : undefined

type RecordOfEvents<T extends Node = Node> = {
  [P in keyof T as NodeEvent<T, P> extends undefined
    ? never
    : EventName<NonNullable<NodeEvent<T, P>>['baseName']>]?: NonNullable<
    NodeEvent<T, P>
  >['exampleFun']
}
