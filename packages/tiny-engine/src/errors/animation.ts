import { TinyEngineError } from './base.js'

export class AnimationError extends TinyEngineError {
  constructor(message: string) {
    super(message)
    this.name = 'AnimationError'
  }
}

export class KeyframeNotFoundError extends AnimationError {
  constructor(index: number) {
    super(`Keyframe at index ${index} does not exist`)
  }
}
