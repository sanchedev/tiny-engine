import { processTinyNode, getNodeFromTinyNode } from '../jsx/tiny-node.js'
import type { TinyNode } from '../jsx/types.js'
import type { Node } from '../nodes/node.js'
import { pushEffect } from './context.js'

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

  const spawn = (tinyNode: TinyNode) => {
    if (nodeRef == null) throw new Error('Node does not exist yet.')

    const children = processTinyNode(tinyNode)

    nodeRef.addChild(...children)
  }

  pushEffect((tinyNode) => {
    if (node == null) {
      nodeRef = getNodeFromTinyNode(tinyNode)
      if (nodeRef == null) {
        throw new Error('The main node should be an only node.')
      }
    }
  })

  return spawn
}
