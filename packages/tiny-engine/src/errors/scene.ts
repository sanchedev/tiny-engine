import { TinyEngineError } from './base.js'

export class SceneError extends TinyEngineError {
  constructor(message: string) {
    super(message)
    this.name = 'SceneError'
  }
}

export class SceneNotFoundError extends SceneError {
  constructor(name: string) {
    super(`Scene "${name}" does not exist`)
  }
}

export class InvalidSceneRootError extends SceneError {
  constructor() {
    super(`Scene root must be an instance of Node`)
  }
}
