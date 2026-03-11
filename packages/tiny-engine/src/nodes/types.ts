import type { Node, nodeName } from './node.js'
import type { Sprite, spriteNodeName } from './sprite.js'
import type {
  AnimationPlayer,
  animationPlayerNodeName,
} from './animation-player.js'
import type { View, viewNodeName } from './ui/view.js'
import type { Text, textNodeName } from './ui/text.js'
import type { Collider, colliderNodeName } from './collider.js'

export interface NodeClasses {
  [nodeName]: typeof Node
  [spriteNodeName]: typeof Sprite
  [animationPlayerNodeName]: typeof AnimationPlayer
  [colliderNodeName]: typeof Collider
  // ui
  [viewNodeName]: typeof View
  [textNodeName]: typeof Text
}

export type NodeName = keyof NodeClasses

type a<T extends Node> = new (options: NodeToOptions<typeof Node>) => T

export type NodesOptions = {
  [P in NodeName]: NodeToOptions<NodeClasses[P]>
}

export type NodeInstances = {
  [P in NodeName]: InstanceType<NodeClasses[P]>
}

export type NodeToOptions<T extends typeof Node> = ConstructorParameters<T>[0]
