import type { NodeOptions } from './index.js'

import { Node, nodeName } from './node.js'
import { Sprite, spriteNodeName } from './sprite.js'
import { AnimationPlayer, animationPlayerNodeName } from './animation-player.js'
import { View, viewNodeName } from './ui/view.js'
import { Text, textNodeName } from './ui/text.js'

export type Children = undefined | Node | Node[]

export type WithChildren<T extends NodeOptions> = Omit<T, 'children'> & {
  children?: Children
}

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

export type Elements = {
  [P in keyof NodesOptions]: WithChildren<NodesOptions[P]>
}

export type TypeElements = {
  [P in keyof typeof Nodes]: (typeof Nodes)[P]['prototype']
}

export type NodeToOptions<T extends typeof Node> = ConstructorParameters<T>[0]
