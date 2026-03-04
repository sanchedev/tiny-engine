import { getTexture, type Texture } from '../classes/texture.js'
import type { Vector2 } from '../classes/vector2.js'
import { Node, type NodeOptions } from './node.js'

export interface SpriteOptions extends NodeOptions {
  textureId: string
  margin?: Vector2
  size?: Vector2
}

export class Sprite extends Node {
  nodeName = 'sprite'

  texture: Texture
  margin?: Vector2 | undefined
  size?: Vector2 | undefined

  constructor(options: SpriteOptions) {
    super(options)

    this.texture = getTexture(options.textureId)
    this.margin = options.margin
    this.size = options.size
  }

  draw(delta: number): void {
    this.texture.draw({
      position: this.position,
      margin: this.margin,
      size: this.size,
    })

    super.draw(delta)
  }
}
