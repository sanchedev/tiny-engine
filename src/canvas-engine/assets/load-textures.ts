import { Texture, textures } from '../assets/texture.js'

export async function loadTexture(id: string, url: string): Promise<void> {
  if (textures.get(id)?.image.src === url) return

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
