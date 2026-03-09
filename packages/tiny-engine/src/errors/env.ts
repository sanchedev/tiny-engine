import { TinyEngineError } from './base.js'

export class EnvironmentError extends TinyEngineError {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentError'
  }
}

export class Context2DNotSupportedError extends EnvironmentError {
  constructor() {
    super('CanvasRenderingContext2D is not supported in this browser')
  }
}
