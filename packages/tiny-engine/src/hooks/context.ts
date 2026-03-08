import type { TinyNode } from '../jsx/types.js'

export interface HookContext {
  node: TinyNode | null
  effects: HookEffect[]
}

type HookEffect = (tinyNode: TinyNode) => void

let currentContext: HookContext[] = []

export function startHooks() {
  currentContext.push({
    node: null,
    effects: [],
  })
}

export function finishHooks(node: TinyNode) {
  if (!currentContext) return

  currentContext.at(-1)?.effects.forEach((fn) => fn(node))
  currentContext.pop()
}

export function pushEffect(effect: HookEffect) {
  if (!currentContext) {
    throw new Error('Hooks can only be used inside components.')
  }

  currentContext.at(-1)?.effects.push(effect)
}
