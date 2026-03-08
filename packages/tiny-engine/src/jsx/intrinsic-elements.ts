import { Node, nodeName, type NodeOptions } from '../nodes/node.js'
import { Sprite, spriteNodeName } from '../nodes/sprite.js'
import {
  AnimationPlayer,
  animationPlayerNodeName,
} from '../nodes/animation-player.js'
import { View, viewNodeName } from '../nodes/ui/view.js'
import { Text, textNodeName } from '../nodes/ui/text.js'
import type { NodesOptions } from '../nodes/types.js'
import type { UsedNode } from '../hooks/node.js'

export interface NodeElement<T extends Node = Node> {
  /** The **`use`** property can be user for `useNode` hook.
   * @example
   * ```tsx
   * const sprite = useNode()
   *
   * return <sprite use={sprite} />
   * ```
   */
  use?: T
  /** The **`onStart`** property connects a function to `Node.started` event.
   * @example
   * ```tsx
   * const handleStart = () => {
   *   // ...
   * }
   *
   * return <node onStart={handleStart} />
   * ```
   */
  onStart?: Parameters<Node['started']['on']>[0]
  /** The **`onDraw`** property connects a function to `Node.drawed` event.
   * @example
   * ```tsx
   * const handleDraw = (delta: number) => {
   *   // ...
   * }
   *
   * return <node onDraw={handleDraw} />
   * ```
   */
  onDraw?: Parameters<Node['drawed']['on']>[0]
  /** The **`onUpdate`** property connects a function to `Node.updated` event.
   * @example
   * ```tsx
   * const handleUpdate = (delta: number) => {
   *   // ...
   * }
   *
   * return <node onUpdate={handleUpdate} />
   * ```
   */
  onUpdate?: Parameters<Node['updated']['on']>[0]
  /** The **`onDestroy`** property connects a function to `Node.destroyed` event.
   * @example
   * ```tsx
   * const handleDestroy = () => {
   *   // ...
   * }
   *
   * return <node onDestroy={handleDestroy} />
   * ```
   */
  onDestroy?: Parameters<Node['destroyed']['on']>[0]
}

export interface AnimationPlayerElement<
  T extends AnimationPlayer = AnimationPlayer,
> extends NodeElement<T> {
  /** The **`onAnimationChange`** property connects a function to `AnimationPlayer.animationChanged` event.
   * @example
   * ```tsx
   * const handleAnimationChange = (newAnim: string, oldAnim: string | null) => {
   *   // ...
   * }
   *
   * return <animation-player onAnimationChange={handleAnimationChange} />
   * ```
   */
  onAnimationChange?: Parameters<AnimationPlayer['animationChanged']['on']>[0]
  /** The **`onAnimationEnd`** property connects a function to `AnimationPlayer.animationEnded` event.
   * @example
   * ```tsx
   * const handleAnimationEnd = (anim: string) => {
   *   // ...
   * }
   *
   * return <animation-player onAnimationEnd={handleAnimationEnd} />
   * ```
   */
  onAnimationEnd?: Parameters<AnimationPlayer['animationEnded']['on']>[0]
  /** The **`onAnimationIndexChange`** property connects a function to `AnimationPlayer.animationIndexChanged` event.
   * @example
   * ```tsx
   * const handleAnimationIndexChange = (index: number) => {
   *   // ...
   * }
   *
   * return <animation-player onAnimationIndexChange={handleAnimationIndexChange} />
   * ```
   */
  onAnimationIndexChange?: Parameters<
    AnimationPlayer['animationIndexChanged']['on']
  >[0]
  /** The **`onAnimationStop`** property connects a function to `AnimationPlayer.animationStopped` event.
   * @example
   * ```tsx
   * const handleAnimationStop = (anim: string) => {
   *   // ...
   * }
   *
   * return <animation-player onAnimationStop={handleAnimationStop} />
   * ```
   */
  onAnimationStop?: Parameters<AnimationPlayer['animationStopped']['on']>[0]
}

export const NodeElements = {
  [nodeName]: (node: Node, opts: NodeElement<Node>) => {
    return addNodeElement(node, opts)
  },
  [spriteNodeName]: (node: Sprite, opts: NodeElement<Sprite>) => {
    return addNodeElement(node, opts)
  },
  [animationPlayerNodeName]: (
    node: AnimationPlayer,
    opts: AnimationPlayerElement<AnimationPlayer>,
  ) => {
    return addAnimationPlayerElement(addNodeElement(node, opts), opts)
  },
  // ui
  [viewNodeName]: (node: View, opts: NodeElement<View>) => {
    return addNodeElement(node, opts)
  },
  [textNodeName]: (node: Text, opts: NodeElement<Text>) => {
    return addNodeElement(node, opts)
  },
}

function addNodeElement<T extends Node>(node: T, opts: NodeElement): T {
  if (opts.onStart) node.started.on(opts.onStart)
  if (opts.onDraw) node.drawed.on(opts.onDraw)
  if (opts.onUpdate) node.updated.on(opts.onUpdate)
  if (opts.onDestroy) node.destroyed.on(opts.onDestroy)
  if (opts.use) {
    const used = opts.use as T & { __used?: UsedNode<T> }
    if (used.__used && 'node' in used.__used) {
      used.__used.node = node
    } else {
      throw new Error('Only usedsNodes can be set in use property.')
    }
  }
  return node
}

function addAnimationPlayerElement<T extends AnimationPlayer>(
  node: T,
  opts: AnimationPlayerElement,
): T {
  if (opts.onAnimationChange) node.animationChanged.on(opts.onAnimationChange)
  if (opts.onAnimationEnd) node.animationEnded.on(opts.onAnimationEnd)
  if (opts.onAnimationIndexChange)
    node.animationIndexChanged.on(opts.onAnimationIndexChange)
  if (opts.onAnimationStop) node.animationStopped.on(opts.onAnimationStop)
  return node
}

export type NodeIntrinsicElements = {
  [P in keyof typeof NodeElements]: WithChildren<NodesOptions[P]> &
    Parameters<(typeof NodeElements)[P]>[1]
}

type Children = undefined | Node | Node[]

type WithChildren<T extends NodeOptions> = Omit<T, 'children'> & {
  children?: Children
}
