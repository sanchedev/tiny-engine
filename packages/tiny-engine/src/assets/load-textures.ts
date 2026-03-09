import { Texture, textures } from '../assets/texture.js'
import { TextureAlreadyRegisteredError } from '../errors/assets.js'

/**
 * The **`loadTexture`** function loads textures for be used.
 * @param id Id for the texture
 * @param url Image Url
 */
export async function loadTexture(id: string, url: string): Promise<void> {
  const texture = textures.get(id)
  if (texture != null) {
    if (texture.image.src === url) return

    throw new TextureAlreadyRegisteredError(id, texture.image.src, url)
  }

  const image = new Image()

  await new Promise<void>((resolve, reject) => {
    const removeEvents = () => {
      image.removeEventListener('loadedmetadata', onLoaded)
      image.removeEventListener('error', onError)
    }

    const onLoaded = () => {
      removeEvents()
      resolve()
    }
    const onError = (err: ErrorEvent) => {
      removeEvents()
      reject(err)
    }

    image.addEventListener('load', onLoaded)
    image.addEventListener('error', onError)

    image.src = url
  })

  textures.set(id, new Texture(image))
}
