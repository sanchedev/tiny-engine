import { Node, type NodeOptions } from 'tiny-engine'

export interface EntityOptions extends NodeOptions {}

export class Entity extends Node {
  constructor(options: EntityOptions) {
    super(options)
  }
}
