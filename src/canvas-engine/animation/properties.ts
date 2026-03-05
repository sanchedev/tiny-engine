import type { AnimationKeyframe } from '../nodes/animation-player.js'
import type { Node } from '../nodes/node.js'

export function kfFromProp<T extends Node, K extends keyof T>(
  node: T,
  property: K,
  value: T[K],
): AnimationKeyframe {
  return () => {
    node[property] = value
  }
}
