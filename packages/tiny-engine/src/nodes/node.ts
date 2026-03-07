import { Vector2 } from '../math/vector2.js'
import { GameConfig } from '../core/game-config.js'
import { Event } from '../events/event.js'
import { Nodes, type TypeElements } from './types.js'
import { Game } from '../core/game.js'

export interface NodeOptions {
  /**
   * The read-only **`id`** property of `Node` represents the node's identifier.
   * It can be used to get this node.
   * It can be not unique.
   * Should match with ([a-zA-Z][a-zA-Z0-9-_]*)
   *
   * @example
   * ```jsx
   * useStart((node) => {
   *   const container = node.getChild('container')
   *   // ...
   * })
   *
   * return (
   *   <node>
   *     <node id='container' />
   *   </node>
   * )
   * ```
   *
   * **`id`** can be used as path.
   *
   * @example
   * ```jsx
   * useStart((node) => {
   *   const child2 = node.getChild('child/child2')
   *   // ...
   * })
   *
   * return (
   *   <node>
   *     <node id='child1'>
   *       <node id='child2' />
   *     </node>
   *   </node>
   * )
   * ```
   */
  id?: string
  /**
   * The **`position`** property of a `Node`.
   * It represents the position in the plane.
   *
   * @example
   * ```jsx
   * useUpdate((node, delta) => {
   *   node.position.x += delta * 20
   *   // ...
   * })
   *
   * return (
   *   <node>
   *     <sprite textureId='ball'>
   *       {
   *        // ...
   *       }
   *     </sprite>
   *   </node>
   * )
   * ```
   */
  position?: Vector2
  /**
   * The **`zIndex`** property of a `Node`.
   * It represents the position in Z in the plane.
   *
   * @example
   * ```jsx
   * <node>
   *   <sprite textureId='ball' zIndex={0} />
   *   <sprite textureId='ball-2' zIndex={1} />
   * </node>
   * ```
   */
  zIndex?: number
  /**
   * The **`deltaIncrease`** property of a `Node` change the speed of self.
   *
   * @example
   * ```jsx
   * useUpdate((node, delta) => {
   *   node.position.x += delta * 20
   * })
   *
   * // Speed x0.5
   * return (
   *   <node deltaIncrease={0.5}>
   *     <Ball />
   *   </node>
   * )
   * ```
   */
  deltaIncrease?: number
  children?: Node[]
}

/** Default **`id`** for `Node` and it is used for jsx tags */
export const nodeName = 'node'

const idRegEx = /([a-zA-Z][a-zA-Z0-9-_]*)/g

export class Node {
  #id: string
  /**
   * The **`position`** property of a `Node`.
   * It represents the position in the plane.
   *
   * @example
   * ```jsx
   * useUpdate((node, delta) => {
   *   node.position.x += delta * 20
   *   // ...
   * })
   *
   * return (
   *   <node>
   *     <sprite textureId='ball'>
   *       {
   *        // ...
   *       }
   *     </sprite>
   *   </node>
   * )
   * ```
   */
  position: Vector2 = Vector2.ZERO
  #zIndex: number = 0
  _parent?: Node
  _children: Node[] = []
  /**
   * The **`deltaIncrease`** property of a `Node` change the speed of self.
   *
   * @example
   * ```jsx
   * useUpdate((node, delta) => {
   *   node.position.x += delta * 20
   * })
   *
   * // Speed x0.5
   * return (
   *   <node deltaIncrease={0.5}>
   *     <Ball />
   *   </node>
   * )
   * ```
   */
  deltaIncrease: number = 1

  // States
  /**
   * The **`isStarted`** property of the `Node` indicates whether the node is started.
   */
  isStarted: boolean = false
  /**
   * The **`isDestroyed`** property of the `Node` indicates whether the node is destroyed.
   */
  isDestroyed: boolean = false

  constructor({ id, position, zIndex, deltaIncrease, children }: NodeOptions) {
    if (id) {
      const matches = id.match(idRegEx)
      if (matches == null || matches.length !== 1 || matches[0] !== id) {
        throw new Error(
          'The id ' + id + ' does not matches with `([a-zA-Z][a-zA-Z0-9-_]*)`',
        )
      }
    }

    this.#id = id ?? nodeName
    if (position != null) this.position = position
    if (zIndex != null) this.#zIndex = zIndex
    if (deltaIncrease != null) this.deltaIncrease = deltaIncrease
    this._children.push(...(children ?? []))
  }

  /**
   * The read-only **`id`** property of `Node` represents the node's identifier.
   * It can be used to get this node.
   * It can be not unique.
   * Should match with ([a-zA-Z][a-zA-Z0-9-_]*)
   *
   * @example
   * ```jsx
   * useStart((node) => {
   *   const container = node.getChild('container')
   *   // ...
   * })
   *
   * return (
   *   <node>
   *     <node id='container' />
   *   </node>
   * )
   * ```
   *
   * **`id`** can be used as path.
   *
   * @example
   * ```jsx
   * useStart((node) => {
   *   const child2 = node.getChild('child/child2')
   *   // ...
   * })
   *
   * return (
   *   <node>
   *     <node id='child1'>
   *       <node id='child2' />
   *     </node>
   *   </node>
   * )
   * ```
   */
  get id() {
    return this.#id
  }

  /**
   * The read-only **`parent`** property returns the parent of a specified `Node`.
   *
   * @example
   * ```jsx
   * useStart((node) => {
   *   const parent = node.parent
   *   parent?.destroy()
   *   // ...
   * })
   *
   * return (
   *   <node>
   *     <node id='container' />
   *   </node>
   * )
   * ```
   */
  get parent() {
    return this._parent
  }

  /**
   * The read-only **`children`** property returns the child `Node`s.
   *
   * @example
   * ```jsx
   * useStart((node) => {
   *   const children = node.children
   *   console.log(children) // [Node]
   *   // ...
   * })
   *
   * return (
   *   <node>
   *     <node id='container' />
   *   </node>
   * )
   * ```
   */
  get children() {
    return this._children
  }

  /**
   * Gets or sets the **`globalPosition`** of the `Node`.
   */
  set globalPosition(value) {
    this.position = value.toSubtracted(
      this._parent?.globalPosition ?? Vector2.ZERO,
    )
  }
  get globalPosition(): Vector2 {
    if (this._parent) {
      return this.position.toAdded(this._parent.globalPosition)
    }
    return this.position
  }
  /**
   * Gets or sets the **`zIndex`** of the `Node`.
   */
  set zIndex(value: number) {
    if (value === this.#zIndex) return
    this.zIndexChanged.emit(value)
    this.#zIndex = value
  }
  get zIndex(): number {
    return this.#zIndex
  }
  /**
   * Gets or sets the **`globalZIndex`** of the `Node`.
   */
  set globalZIndex(value) {
    if (this._parent == null) this.zIndex = value
    else this.zIndex = value - this._parent.globalZIndex
  }
  get globalZIndex(): number {
    if (this._parent == null) return this.zIndex
    return this.zIndex + this._parent.globalZIndex
  }
  /**
   * Gets or sets the **`globalDeltaIncrease`** of the `Node`.
   */
  set globalDeltaIncrease(value) {
    if (this._parent == null) this.deltaIncrease = value
    else this.deltaIncrease = value / this._parent.globalDeltaIncrease
  }
  get globalDeltaIncrease(): number {
    if (this._parent == null) return this.deltaIncrease
    return this.deltaIncrease * this._parent.globalDeltaIncrease
  }

  // Methods
  /**
   * Returns the first element that is a descendant of this `Node` that matches path.
   *
   * If `path` is undefined then the method will return the first node with type `nodeType`.
   *
   * @param options Options to filter nodes
   * @returns Returns the node or throw an error.
   *
   * @example
   * **Without path**
   * ```ts
   * const sprite = node.getChild({ nodeType: 'sprite' })
   * ```
   *
   * @example
   * **With relative path**
   * ```ts
   * const gun = node.getChild({ nodeType: 'sprite', path: 'gun' })
   * ```
   * ```ts
   * const ball = node.getChild({ nodeType: 'sprite', path: '../ball' })
   * ```
   *
   * @example
   * **With absolute path**
   * ```ts
   * const mainNode = node.getChild({ nodeType: 'sprite', path: '/' })
   * ```
   * ```ts
   * const box = node.getChild({ nodeType: 'node', path: '/box' })
   * ```
   */
  getChild<T extends keyof TypeElements>(options: {
    nodeType: T
    path?: string
  }): TypeElements[T] {
    const { nodeType, path } = options

    if (!(nodeType in Nodes)) {
      throw new Error(`Node with type ${nodeType} does not exist.`)
    }

    let node: Node | undefined

    if (path != null) {
      const pathSplitted = path.split('/')
      if (path.startsWith('/')) {
        node = Game.sceneManager.currentNode ?? undefined
        pathSplitted.shift()
      } else {
        node = this
      }

      for (let i = 0; i < pathSplitted.length; i++) {
        if (node == null) break
        const n = pathSplitted[i]
        if (n === '' && i === pathSplitted.length - 1) break
        if (n === '.') {
          continue
        }
        if (n === '..') {
          node = node.parent
          continue
        }
        node = node._children.find((node) => node.id === n)
      }
    } else {
      node = this.children.find((node) => node instanceof Nodes[nodeType])
    }

    if (node == null)
      throw new Error(
        'The node `' + path + '` in `' + this.id + '` does not exist.',
      )

    if (node instanceof Nodes[nodeType]) return node as TypeElements[T]
    throw new Error(
      'The node `' +
        path +
        '` in ' +
        this.toString() +
        ' is not a ' +
        nodeType +
        '.',
    )
  }

  /**
   * Add child to this `Node`
   * @param child Child to add
   */
  addChild(child: Node) {
    this.#attachChild(child)
    this._children.push(child)
    this.#sortChildren()
    if (this.isStarted) {
      child.start()
    }
  }

  #attachChild(child: Node) {
    child._parent = this
    child.zIndexChanged.on(() => {
      this.#sortChildren()
    })
  }
  #sortChildren() {
    this._children.sort((a, b) => a.globalZIndex - b.globalZIndex)
  }

  // Events
  /**
   * Detects whether `zIndex` **change**
   */
  zIndexChanged = new Event<[zIndex: number]>()
  /**
   * Detects whether this `Node` **start**
   */
  started = new Event<[]>()
  /**
   * Detects whether this `Node` **is drawing**
   */
  drawed = new Event<[delta: number]>()
  /**
   * Detects whether this `Node` **is updating**
   */
  updated = new Event<[delta: number]>()
  /**
   * Detects whether this `Node` is **destroyed**
   */
  destroyed = new Event<[]>()

  start(): void {
    for (const child of this._children) {
      this.#attachChild(child)
    }
    this.isStarted = true
    this.#sortChildren()

    for (const node of this._children) {
      node.start()
    }
    this.started.emit()
  }
  update(delta: number): void {
    this.updated.emit(delta)
    for (const node of this._children) {
      node.update(delta * node.deltaIncrease)
    }
  }
  draw(delta: number): void {
    this.drawed.emit(delta)
    for (const node of this._children) {
      GameConfig.ctx.translate(this.position.x, this.position.y)
      GameConfig.translate.add(this.position)
      node.draw(delta * node.deltaIncrease)
      GameConfig.translate.subtract(this.position)
      GameConfig.ctx.translate(-this.position.x, -this.position.y)
    }
  }

  /**
   * The **`destroy`** method destroys and cleans this node.
   */
  destroy() {
    if (this.isDestroyed) return

    const q = this._parent != null ? this._parent._children : []

    const index = q.indexOf(this)
    if (index < 0) return
    q.splice(index, 1)

    this.isDestroyed = true

    this.destroyed.emit()
    for (const node of this._children) {
      node.destroy()
    }
  }
}
