import { Vector2 } from '../../math/vector2.js'
import { GameConfig } from '../../core/game-config.js'
import { Node, type NodeOptions } from '../node.js'
import { Nodes } from '../registry.js'

export interface ViewOptions extends NodeOptions {
  backgroundColor?: string
  size: Vector2
}

export const viewNodeName = 'view'

export class View extends Node {
  backgroundColor: string
  size: Vector2

  constructor(options: ViewOptions) {
    super({ ...options, id: options.id ?? viewNodeName })

    this.backgroundColor = options.backgroundColor ?? '#FFFFFF'
    this.size = options.size
  }

  draw(delta: number): void {
    GameConfig.ctx.fillStyle = this.backgroundColor
    GameConfig.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y,
    )

    super.draw(delta)
  }
}

Nodes.view = View
