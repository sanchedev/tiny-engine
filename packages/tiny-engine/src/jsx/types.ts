import type { Node } from '../nodes/node.js'

export type TinyNode = undefined | Node | Node[]

export type WithChildren<T> = Omit<T, 'children'> & {
  children?: TinyNode
}
