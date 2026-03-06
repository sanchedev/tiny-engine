import { Node, type NodeOptions } from './nodes/index.js'

type TinyComponent = typeof Node | ((props: any) => Node)

type PropsOf<T> = T extends (props: infer P) => Node
  ? P
  : T extends new (props: infer P) => Node
    ? P
    : never

type ReturnTypeOf<T> = T extends (props: any) => infer R
  ? R
  : T extends new (props: any) => infer R
    ? R
    : never

type WithChildren<P> = P & {
  children?: Node | Node[]
}

export function jsx<T extends TinyComponent>(
  type: T,
  props: WithChildren<PropsOf<T>>,
): ReturnTypeOf<T> {
  const { children } = props

  const safeChildren = children?.flat(Infinity)

  if (
    typeof type === 'function' &&
    (type.prototype instanceof Node || type === Node)
  ) {
    return new (type as typeof Node)({
      ...props,
      children: safeChildren,
    }) as ReturnTypeOf<T>
  }

  return (type as (props: any) => Node)({
    ...props,
    children: safeChildren,
  }) as ReturnTypeOf<T>
}

export const jsxs = jsx
export const Fragment = (props: NodeOptions) => new Node(props)

type TinyElement<T extends Node = Node> = T

declare global {
  namespace JSX {
    type Element = TinyElement
  }
}
