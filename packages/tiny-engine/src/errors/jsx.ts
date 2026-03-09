import { TinyEngineError } from './base.js'

export class JSXError extends TinyEngineError {
  constructor(message: string) {
    super(message)
    this.name = 'JSXError'
  }
}

export class InvalidJSXElementTypeError extends JSXError {
  constructor(type: unknown) {
    super(
      `Invalid JSX element type: ${String(type)}. Expected a Node type, intrinsic element, or component.`,
    )
  }
}

export class UnknownIntrinsicElementError extends JSXError {
  constructor(name: string) {
    super(`Unknown intrinsic element "${name}"`)
  }
}
