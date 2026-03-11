import {
  HookRequiresNodeRootError,
  NodeHookTypeMismatchError,
} from '../errors/hook.js'
import { NodeNotInitializedError } from '../errors/lifecycle.js'
import { Node } from '../nodes/node.js'
import { Nodes } from '../nodes/registry.js'
import { type NodeInstances } from '../nodes/types.js'
import { getNodeName } from '../nodes/utils.js'
import { pushEffect } from './context.js'

interface UsedNode<T extends Node> {
  node: T | undefined
}

export type NodeSetter = (node: Node) => void

export const NODE_REF = Symbol('nodeRef')

/**
 * The **`useNode`** hooks gets a node by options.
 * @param options The same options of Node.getChild
 *
 * @example
 * **Without options**
 *
 * ```tsx
 * const node = useNode('node')
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
 * const sprite = useNode({ nodeType: 'sprite', path: 'child1/child2' })
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
export function useNode<T extends keyof NodeInstances = 'node'>(
  options:
    | {
        nodeType: T
        path?: string
      }
    | T,
): NodeInstances[T] {
  const nodeRef: UsedNode<NodeInstances[T]> = {
    node: undefined,
  }

  const nodeType = typeof options === 'string' ? options : options.nodeType
  const nodeName = typeof options !== 'string' ? options.path : null

  const proxy = createNodeProxy(
    nodeRef,
    nodeName ? nodeName : 'Type: ' + nodeType,
    nodeType,
  )

  if (typeof options === 'string') return proxy

  pushEffect('useNode', (nodes) => {
    const node = nodes.length === 1 ? nodes[0]! : undefined
    if (node == null) {
      throw new HookRequiresNodeRootError('useNode')
    }

    node.started.onFirst(() => {
      nodeRef.node = node.getChild(options)
    })
  })

  return proxy
}

function createNodeProxy<T extends Node>(
  used: UsedNode<T>,
  nodeName: string,
  nodeType: keyof typeof Nodes,
) {
  return new Proxy(used, {
    get(target, prop) {
      if (prop === NODE_REF) {
        return ((node) => {
          if (Object.getPrototypeOf(node) !== Nodes[nodeType].prototype) {
            throw new NodeHookTypeMismatchError(nodeType, getNodeName(node))
          }
          used.node = node as T
        }) as NodeSetter
      }

      const node = target.node

      if (!node) {
        throw new NodeNotInitializedError(nodeName)
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
        throw new NodeNotInitializedError(nodeName)
      }

      node[prop as keyof typeof node] = value
      return true
    },
  }) as unknown as T
}
