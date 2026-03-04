import type { Node } from '../nodes/node.js'
import type { Event } from './event.js'

type FunEv<T extends Event<any[]>> = Parameters<T['on']>[0]
type ParEv<T extends Event<any[]>> = Parameters<FunEv<T>>
type NodEv<T extends Event<any[]>, K extends Node> = (
  node: K,
  ...args: ParEv<T>
) => void

export function useNode<T extends Node>() {
  let started: NodEv<Node['started'], T> | undefined
  let drawed: NodEv<Node['drawed'], T> | undefined
  let updated: NodEv<Node['updated'], T> | undefined
  let destroyed: NodEv<Node['destroyed'], T> | undefined

  const node = (node: T) => {
    if (started != null) execEv(node.started, node, started)
    if (drawed != null) execEv(node.drawed, node, drawed)
    if (updated != null) execEv(node.updated, node, updated)
    if (destroyed != null) execEv(node.destroyed, node, destroyed)
    return node
  }

  const onStart = (fn: NodEv<Node['started'], T>) => {
    started = fn
  }
  const onDraw = (fn: NodEv<Node['drawed'], T>) => {
    drawed = fn
  }
  const onUpdate = (fn: NodEv<Node['updated'], T>) => {
    updated = fn
  }
  const onDestroy = (fn: NodEv<Node['destroyed'], T>) => {
    destroyed = fn
  }

  return {
    onStart,
    onDraw,
    onUpdate,
    onDestroy,
    node,
  }
}

function execEv<T extends Event<any[]>, K extends Node>(
  ev: T,
  node: K,
  fn: NodEv<T, K>,
) {
  // @ts-ignore
  ev.on((...args) => fn(node, ...args))
}
