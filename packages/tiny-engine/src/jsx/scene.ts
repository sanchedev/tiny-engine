import { Scene } from '../core/scene.js'
import type { TinyNode } from './types.js'
import { getNodeFromTinyNode } from './tiny-node.js'
import { InvalidSceneRootError } from '../errors/scene.js'
import type { Node } from '../nodes/node.js'

type SceneComp = (() => Promise<TinyNode>) | (() => Promise<() => TinyNode>)

export function sceneRender(comp: SceneComp): Scene {
  return new Scene(async () => {
    const tinyNode = await comp()

    let node: Node | undefined

    if (typeof tinyNode === 'function') {
      node = getNodeFromTinyNode(tinyNode())
    } else {
      node = getNodeFromTinyNode(tinyNode)
    }

    if (node == null) throw new InvalidSceneRootError()

    return node
  })
}
