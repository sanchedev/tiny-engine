import { registerNode } from 'tiny-engine'
import { Entity } from './entity'

declare module 'tiny-engine' {
  interface NodeClasses {
    entity: typeof Entity
  }
}

registerNode('entity', Entity)
