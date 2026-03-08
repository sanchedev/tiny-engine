import type { Node } from '../nodes/node.js'
import type { TypeElements } from '../nodes/types.js'
import { pushEffect } from './context.js'

export interface UsedNode<T extends Node> {
  node: T | undefined
  get(): T
}

export const NODE_REF = Symbol('nodeRef')

/**
 * The **`useNode`** hooks gets a node by options.
 * @param options The same options of Node.getChild
 *
 * @example
 * **Without options**
 *
 * ```tsx
 * const node = useNode()
 *
 * // console.log(node) // Proxy
 * // console.log(node.position) // ERROR!
 *
 * const handleStart = () => {
 *   console.log(node) // Node
 * }
 *
 * return <node use={node} onStart={handleStart} />
 * ```
 *
 * @example
 * **With options**
 *
 * ```tsx
 * const sprite = useNode<'sprite'>({ nodeType: 'sprite', path: 'child1/child2' })
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
}): TypeElements[T] {
  const nodeRef: UsedNode<TypeElements[T]> = {
    node: undefined,
    get: () => {
      if (nodeRef.node == null) throw new Error('The node is not exist yet.')
      return nodeRef.node
    },
  }

  const proxy = createNodeProxy(nodeRef)

  if (options == null) return proxy

  pushEffect((node) => {
    node.started.onFirst(() => {
      nodeRef.node = node.getChild(options)
    })
  })

  return proxy
}

function createNodeProxy<T extends Node>(used: UsedNode<T>) {
  return new Proxy(used, {
    get(target, prop) {
      if (prop === NODE_REF) return used

      const node = target.node

      if (!node) {
        throw new Error('Node not mounted yet')
      }

      const el = Reflect.get(node, prop)

      if (typeof el === 'function') {
        return el.bind(node)
      }

      return el
    },
    set(target, prop, value) {
      const node = target.node

      if (!node) {
        throw new Error('Node not mounted yet')
      }

      node[prop as keyof typeof node] = value
      return true
    },
  }) as unknown as T
}
