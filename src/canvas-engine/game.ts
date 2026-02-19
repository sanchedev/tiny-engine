import { SceneManager } from './classes/scene-manager.js'
import { getGameConfig } from './game-config.js'
import { Event } from './lib/event.js'

export class Game {
  static sceneManager = new SceneManager()

  static loop(delta: number) {
    const gameConfig = getGameConfig()
    const node = this.sceneManager.currentNode

    gameConfig.ctx.clearRect(0, 0, gameConfig.width, gameConfig.height)

    if (node == null) return

    node.update(delta)
    node.draw(delta)
  }

  static blured = new Event<[]>()
}
