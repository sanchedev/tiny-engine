import { processTinyNode } from '../tiny-node'

export function isFuncComponent(obj: any): obj is FuncComponent {
  if (typeof obj !== 'function') return false
  if (Object.getOwnPropertyDescriptor(obj, 'prototype')?.writable !== true)
    return false
  return true
}

type FuncComponent = (...args: any[]) => any

export function getNodeFromFuncComponent<T extends FuncComponent>(
  func: T,
  props: Parameters<T>[0],
) {
  const node = func(props)
  return processTinyNode(node)
}
