import type { Node } from '../nodes/node.js'
import type { TypeElements } from '../nodes/types.js'
import { pushEffect } from './context.js'

export interface UsedNode<T extends Node> {
  node: T | undefined
  get(): T
}

/**
 * The **`useNode`** hooks gets a node by options.
 * @param options The same options of Node.getChild
 *
 * @example
 * **Without options**
 *
 * ```tsx
 * const nodeUsed = useNode()
 *
 * console.log(nodeUsed.node) // undefined
 * // console.log(nodeUsed.get()) // ERROR!
 *
 * const handleStart = () => {
 *   console.log(nodeUsed.node) // Node
 *   console.log(nodeUsed.get()) // Node
 * }
 *
 * return <node use={nodeUsed} onStart={handleStart} />
 * ```
 *
 * @example
 * **With options**
 *
 * ```tsx
 * const spriteUsed = useNode<'sprite'>({ nodeType: 'sprite', path: 'child1/child2' })
 *
 * return (
 *   <node>
 *     <node id='child1'>
 *       <node id='child2' />
 *     </node>
 *   </node>
 * )
 * ```
 */
export function useNode<T extends keyof TypeElements = 'node'>(options?: {
  nodeType: T
  path?: string
}): UsedNode<TypeElements[T]> {
  const nodeRef: UsedNode<TypeElements[T]> = {
    node: undefined,
    get: () => {
      if (nodeRef.node == null) throw new Error('The node is not exist yet.')
      return nodeRef.node
    },
  }

  if (options == null) return nodeRef

  pushEffect((node) => {
    node.started.onFirst(() => {
      nodeRef.node = node.getChild(options)
    })
  })

  return nodeRef
}
