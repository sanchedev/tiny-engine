import { TinyEngineError } from './base.js'

export class AssetError extends TinyEngineError {
  constructor(message: string) {
    super(message)
    this.name = 'AssetError'
  }
}

export class TextureAlreadyRegisteredError extends AssetError {
  constructor(id: string, oldPath: string, newPath: string) {
    super(
      `Texture "${id}" already registered with path "${oldPath}", cannot register "${newPath}"`,
    )
  }
}

export class TextureNotFoundError extends AssetError {
  constructor(id: string) {
    super(`Texture "${id}" does not exist`)
  }
}
