import { TinyEngineError } from './base.js'

export class EngineStateError extends TinyEngineError {
  constructor(message: string) {
    super(message)
    this.name = 'EngineStateError'
  }
}

export class EngineNotSetupError extends EngineStateError {
  constructor() {
    super('Game cannot start before calling setup()')
  }
}

export class NodeNotInitializedError extends EngineStateError {
  constructor(nodeName: string) {
    super(`Node "${nodeName}" was used before initialization`)
  }
}
