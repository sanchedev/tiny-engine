import { type NodeInstances, type NodeName } from '../../../nodes/types.js'
import { Nodes } from '../../../nodes/registry.js'
import { NODE_REF, type NodeSetter } from '../../../hooks/use-node.js'
import { InvalidUseAttributeError } from '../../../errors/jsx.js'
import { Event } from '../../../events/event.js'
import type { IntrinsicElement } from '../../types.js'

export function isIntrinsicElement(obj: any): obj is NodeName {
  if (typeof obj !== 'string') return false
  if (!(obj in Nodes)) return false
  return true
}

export function applyIntrinsicAttributesToNode<T extends NodeName>(
  node: NodeInstances[T],
  opts: IntrinsicElement<T>,
): NodeInstances[T] {
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

function applyEvents<T extends NodeName>(
  node: NodeInstances[T],
  opts: IntrinsicElement<T>,
) {
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
