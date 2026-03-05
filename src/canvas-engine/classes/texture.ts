import { GameConfig } from '../game-config.js'
import type { Vector2 } from './vector2.js'

export class Texture {
  width: number
  height: number

  constructor(public image: HTMLImageElement) {
    this.width = image.width
    this.height = image.height
  }

  draw(options: TextureDrawOptions) {
    const width = options.size?.x ?? this.width
    const height = options.size?.y ?? this.height

    GameConfig.ctx.drawImage(
      this.image,
      options.margin?.x ?? 0,
      options.margin?.y ?? 0,
      width,
      height,
      options.position.x,
      options.position.y,
      width,
      height,
    )
  }
}

interface TextureDrawOptions {
  position: Vector2
  size?: Vector2 | undefined
  margin?: Vector2 | undefined
}

export const textures = new Map<string, Texture>()

export function getTexture(id: string) {
  const texture = textures.get(id)

  if (texture == null)
    throw new Error('The texture with ID ' + id + ' does not exist.')

  return texture
}
