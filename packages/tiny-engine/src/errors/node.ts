import { Nodes } from '../nodes/registry.js'
import { TinyEngineError } from './base.js'

export class NodeError extends TinyEngineError {
  constructor(message: string) {
    super(message)
    this.name = 'NodeError'
  }
}

export class InvalidNodeIdError extends NodeError {
  constructor(id: string) {
    super(`Invalid node id "${id}". Expected pattern ([a-zA-Z][a-zA-Z0-9-_]*)`)
  }
}

export class NodeChildNotFoundError extends NodeError {
  constructor(path: string) {
    super(`Node child with path "${path}" does not exist`)
  }
}

export class NodeTypeMismatchError extends NodeError {
  constructor(expected: string, received: string) {
    super(`Expected node type "${expected}" but received "${received}"`)
  }
}

export class UnknownNodeTypeError extends NodeError {
  constructor(type: string) {
    super(
      `Unknown node type "${type}". Available types: ${Object.keys(Nodes).join(', ')}`,
    )
  }
}

export class InvalidNodeInstanceError extends NodeError {
  constructor(received: unknown) {
    const type =
      received === null
        ? 'null'
        : received === undefined
          ? 'undefined'
          : (received?.constructor?.name ?? typeof received)

    super(`Expected a Node instance but received ${type}`)
  }
}
