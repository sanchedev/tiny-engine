import { finishHooks, startHooks } from './hooks/context.js'
import { getJSXNode, processTinyNode } from './jsx/index.js'
import type { JSXProps, JSXReturn, TinyType, TinyNode } from './jsx/types.js'

export function jsx<T extends TinyType>(
  type: T,
  props: JSXProps<T>,
): JSXReturn<T> {
  startHooks()

  let node: JSXReturn<T> = getJSXNode(type, props)

  finishHooks(node)

  return node
}

export const jsxs = jsx
export const Fragment = ({ children }: { children: TinyNode }) =>
  processTinyNode(children)
