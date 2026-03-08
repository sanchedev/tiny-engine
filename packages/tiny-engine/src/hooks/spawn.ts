import { processChildren } from '../jsx/children.js'
import type { TinyNode } from '../jsx/types.js'
import type { Node } from '../nodes/node.js'
import { pushEffect } from './context.js'

export function useSpawn(node: Node) {
  let isStarted = false

  const spawn = (tinyNode: TinyNode) => {
    if (!isStarted) throw new Error('Node does not exist yet.')

    const children = processChildren(tinyNode)

    node.addChild(...children)
  }

  pushEffect(() => {
    isStarted = true
  })

  return spawn
}
