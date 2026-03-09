import { InvalidUseAttributeError } from '../../errors/jsx.js'
import { Event } from '../../events/event.js'
import { NODE_REF, type NodeSetter } from '../../hooks/node.js'
import type { Node } from '../../nodes/node.js'
import { getNode, Nodes } from '../../nodes/registry.js'
import { type NodeTypes, type NodesOptions } from '../../nodes/types.js'
import { processTinyNode } from '../tiny-node.js'
import type { WithChildren } from '../types.js'

export function isIntrinsicElement(obj: any): obj is keyof NodeTypes {
  if (typeof obj !== 'string') return false
  if (!(obj in Nodes)) return false
  return true
}

export function getNodeFromintrinsicElement<T extends keyof NodeTypes>(
  nodeName: T,
  options: NodeIntrinsicElements[T],
): (typeof Nodes)[T]['prototype'] {
  const node = getNode(nodeName, {
    ...options,
    children: processTinyNode(options.children),
  })
  return applyToNode(node, options)
}

function applyToNode<T extends Node>(node: T, opts: NodeElement<T>): T {
  if (opts.use) {
    const used = opts.use as T & { [NODE_REF]?: NodeSetter }
    if (typeof used[NODE_REF] !== 'function') {
      throw new InvalidUseAttributeError(used)
    }
    used[NODE_REF](node)
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

export type NodeIntrinsicElements = {
  [P in keyof NodeTypes]: WithChildren<NodesOptions[P]> &
    NodeElement<NodeTypes[P]>
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
