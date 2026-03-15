import { HookRequiresNodeRootError } from '../errors/hook.js'
import { NodeNotInitializedError } from '../errors/lifecycle.js'
import { renderToNodes } from '../jsx/index.js'
import type { Tiny } from '../jsx/types.js'
import type { Node } from '../nodes/node.js'
import { currentContext, pushEffect } from './context.js'

/**
 * The **`useSpawn`** hooks returns a function that can spawn nodes as children of the node that calls the hook.
 * The spawned nodes will be added as children of the node that calls the hook.
 *
 * @example
 * **Without the specified node**
 * ```tsx
 * const spawn = useSpawn()
 *
 * const handleStart = () => {
 *   spawn(
 *     <node>
 *       <sprite />
 *     </node>
 *   )
 * }
 *
 * return <node onStart={handleStart} />
 * ```
 *
 * @example
 * **With the specified node**
 * ```tsx
 * const node = useNode()
 * const spawn = useSpawn(node)
 *
 * const handleStart = () => {
 *   spawn(
 *     <node>
 *       <sprite />
 *     </node>
 *   )
 * }
 *
 * return <node use={node} onStart={handleStart} />
 * ```
 *
 * @param node The node that will be the parent of the spawned nodes. Usually, it's the node that calls the hook.
 * @returns A function that can spawn nodes as children of the node that calls the hook.
 */
export function useSpawn(node?: Node) {
  let nodeRef: Node | undefined = node

  const ctx = currentContext.slice()

  const spawn = (jsx: Tiny.Node) => {
    if (nodeRef == null)
      throw new NodeNotInitializedError(node ? 'Unknown' : 'Root')

    currentContext.push(...ctx)
    const nodes = renderToNodes(jsx)
    for (let i = 0; i < ctx.length; i++) {
      currentContext.pop()
    }

    nodeRef.addChild(...nodes)
  }

  pushEffect('useSpawn', (nodes) => {
    if (node == null) {
      nodeRef = nodes.length === 1 ? nodes[0]! : undefined
      if (nodeRef == null) {
        throw new HookRequiresNodeRootError('useSpawn')
      }
    }
  })

  return spawn
}
