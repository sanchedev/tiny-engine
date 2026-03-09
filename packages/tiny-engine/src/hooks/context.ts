import { HookOutsideComponentError } from '../errors/hook.js'
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

export function pushEffect(hookName: string, effect: HookEffect) {
  if (!currentContext) {
    throw new HookOutsideComponentError(hookName)
  }

  currentContext.at(-1)?.effects.push(effect)
}
