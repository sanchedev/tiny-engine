import type { Node, nodeName } from './node.js'
import type { Sprite, spriteNodeName } from './sprite.js'
import type {
  AnimationPlayer,
  animationPlayerNodeName,
} from './animation-player.js'
import type { View, viewNodeName } from './ui/view.js'
import type { Text, textNodeName } from './ui/text.js'
import type { Nodes } from './registry.js'

export type NodeClasses = {
  [nodeName]: typeof Node
  [spriteNodeName]: typeof Sprite
  [animationPlayerNodeName]: typeof AnimationPlayer
  // ui
  [viewNodeName]: typeof View
  [textNodeName]: typeof Text
}

export type NodesOptions = {
  [P in keyof typeof Nodes]: NodeToOptions<(typeof Nodes)[P]>
}

export type NodeTypes = {
  [P in keyof typeof Nodes]: (typeof Nodes)[P]['prototype']
}

export type NodeToOptions<T extends typeof Node> = ConstructorParameters<T>[0]
