import { GameConfig } from '../core/game-config.js'
import { TextureNotFoundError } from '../errors/assets.js'
import { Vector2 } from '../math/vector2.js'

export class Texture {
  /** The **`width`** of the texture. */
  width: number
  /** The **`height`** of the texture. */
  height: number

  constructor(
    /** A loaded image */
    public image: HTMLImageElement,
  ) {
    this.width = image.width
    this.height = image.height
  }

  /**
   * The **`draw`** method draws the texture in the `canvas`.
   * @param options Texture draw options
   */
  draw(options: TextureDrawOptions) {
    const width = options.size?.x ?? this.width
    const height = options.size?.y ?? this.height

    const rWidth = options.resultSize?.x ?? width
    const rHeight = options.resultSize?.y ?? height

    const flipX = rWidth !== Math.abs(rWidth)
    const flipY = rHeight !== Math.abs(rHeight)

    const scaleX = flipX ? -1 : 1
    const scaleY = flipY ? -1 : 1

    const pos = options.position.toMultiplied(new Vector2(scaleX, scaleY))

    GameConfig.ctx.scale(scaleX, scaleY)
    GameConfig.ctx.drawImage(
      this.image,
      options.margin?.x ?? 0,
      options.margin?.y ?? 0,
      width,
      height,
      pos.x,
      pos.y,
      rWidth,
      rHeight,
    )
    GameConfig.ctx.scale(scaleX, scaleY)
  }
}

interface TextureDrawOptions {
  /** Position to draw */
  position: Vector2
  /** Size of the texture */
  size?: Vector2 | undefined
  /** Size of the result texture */
  resultSize?: Vector2 | undefined
  /** Offset of the texture */
  margin?: Vector2 | undefined
}

export const textures = new Map<string, Texture>()

/**
 * The **`getTexture`** function returns a texture by id.
 * @param id Texture Id
 * @returns A Texture
 */
export function getTexture(id: string) {
  const texture = textures.get(id)

  if (texture == null) throw new TextureNotFoundError(id)

  return texture
}
