import type { Node } from '../nodes/node.js'
import type { Scene } from './scene.js'

export class SceneManager {
  #scenes = new Map<string, Scene>()

  #currentScene: string | null = null

  #currentNode: Node | null = null

  get currentScene() {
    return this.#currentScene
  }

  get currentNode() {
    return this.#currentNode
  }

  changeScene(scene: string) {
    if (!this.#scenes.has(scene)) return

    this.#currentScene = scene
    this.#currentNode = this.#scenes.get(scene)!.render()
  }
}
