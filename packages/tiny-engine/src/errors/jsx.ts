import { Node } from '../nodes/node.js'
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

export class InvalidUseAttributeError extends JSXError {
  constructor(received: unknown) {
    const type =
      received instanceof Node
        ? 'Node instance'
        : received === null
          ? 'null'
          : typeof received

    super(
      `Invalid value for "use" attribute. Expected a proxy returned by useNode(), but received ${type}.`,
    )
  }
}
