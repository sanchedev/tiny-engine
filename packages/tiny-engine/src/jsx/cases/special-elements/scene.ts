import { Game } from '../../../core/game.js'
import { Scene } from '../../../core/scene.js'
import { InvalidSceneRootError } from '../../../errors/scene.js'
import { jsx } from '../../../jsx-runtime.js'
import { getNodeFromTinyNode } from '../../tiny-node.js'
import type { TinyNode } from '../../types.js'

type TinyComponent = () => TinyNode

export type SceneOptions = {
  name: string
  component:
    | (() => Promise<TinyComponent | { default: TinyComponent }>)
    | TinyComponent
}

export function SceneElement(options: SceneOptions) {
  const parseComponent = async () => {
    const comp = await options.component()
    if (typeof comp === 'function') {
      return comp()
    }
    if ((comp as { default: TinyComponent })?.default) {
      return (comp as { default: TinyComponent }).default()
    }
    return comp as TinyNode
  }

  Game.sceneManager.addScene(
    options.name,
    new Scene(async () => {
      const node = getNodeFromTinyNode(await parseComponent())
      if (!node) throw new InvalidSceneRootError()
      return node
    }),
  )

  return null
}
