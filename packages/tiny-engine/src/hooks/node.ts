import { processChildren } from '../jsx/children.js'
import { Node } from '../nodes/node.js'
import type { NodeTypes } from '../nodes/types.js'
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
export function useNode<T extends keyof NodeTypes = 'node'>(options?: {
  nodeType: T
  path?: string
}): NodeTypes[T] {
  const nodeRef: UsedNode<NodeTypes[T]> = {
    node: undefined,
    get: () => {
      if (nodeRef.node == null) throw new Error('The node is not exist yet.')
      return nodeRef.node
    },
  }

  const proxy = createNodeProxy(nodeRef)

  if (options == null) return proxy

  pushEffect((node) => {
    const nodes = processChildren(node)
    const nd = nodes[0]

    if (nodes.length !== 1 || !(nd instanceof Node)) {
      throw new Error('Only can use useNode if the main node is an only Node.')
    }

    nd.started.onFirst(() => {
      nodeRef.node = nd.getChild(options)
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
