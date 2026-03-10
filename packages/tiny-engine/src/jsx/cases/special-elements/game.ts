import { Game } from '../../../core/game.js'
import type { WithChildren } from '../../types.js'

export type GameOptions = WithChildren<
  Parameters<(typeof Game)['setup']>[0]
> & {
  defaultScene: string
}

export function GameElement(options: GameOptions) {
  Game.setup(options)
  Game.sceneManager.setScene(options.defaultScene)

  return null
}
