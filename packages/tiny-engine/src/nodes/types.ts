import { Node, nodeName } from './node.js'
import { Sprite, spriteNodeName } from './sprite.js'
import { AnimationPlayer, animationPlayerNodeName } from './animation-player.js'
import { View, viewNodeName } from './ui/view.js'
import { Text, textNodeName } from './ui/text.js'

export const Nodes = {
  [nodeName]: Node,
  [spriteNodeName]: Sprite,
  [animationPlayerNodeName]: AnimationPlayer,
  // ui
  [viewNodeName]: View,
  [textNodeName]: Text,
}

export type NodesOptions = {
  [P in keyof typeof Nodes]: NodeToOptions<(typeof Nodes)[P]>
}

export type NodeTypes = {
  [P in keyof typeof Nodes]: (typeof Nodes)[P]['prototype']
}

export type NodeToOptions<T extends typeof Node> = ConstructorParameters<T>[0]
