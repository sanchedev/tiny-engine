import { Vector2 } from '../classes/vector2.js'
import { GameConfig } from '../game-config.js'
import { Event } from '../lib/event.js'

export interface NodeOptions {
  id?: string
  position?: Vector2
  zIndex?: number
  children?: Node[]
}

export class Node {
  nodeName = 'node'

  id: string
  position: Vector2 = Vector2.ZERO
  #zIndex: number = 0
  parent?: Node
  children: Node[] = []
  deltaIncrease: number = 1

  // States
  isStarted: boolean = false
  isDestroyed: boolean = false

  constructor({ id, position, zIndex, children }: NodeOptions) {
    this.id = id ?? this.nodeName
    if (position != null) this.position = position
    if (zIndex != null) this.#zIndex = zIndex
    this.children.push(...(children ?? []))
  }

  get globalPosition(): Vector2 {
    if (this.parent) {
      return this.position.toAdded(this.parent.globalPosition)
    }
    return this.position
  }
  set zIndex(value: number) {
    if (value === this.#zIndex) return
    this.zIndexChanged.emit(value)
    this.#zIndex = value
  }
  get zIndex(): number {
    return this.#zIndex
  }
  get globalZIndex(): number {
    if (this.parent == null) return this.zIndex
    return this.zIndex + this.parent.globalZIndex
  }
  get globalDeltaIncrease(): number {
    if (this.parent == null) return this.deltaIncrease
    return this.deltaIncrease + this.parent.globalDeltaIncrease
  }

  // Methods
  getChild<T extends Node>(path: string): T {
    const pathSplitted = path.split('/')
    let node: Node | undefined = this
    for (let i = 0; i < pathSplitted.length; i++) {
      if (node == null) break
      const n = pathSplitted[i]
      node = node.children.find((node) => node.id === n)
    }

    if (node == null)
      throw new Error(
        'The node `' + path + '` in ' + this.toString() + ' does not exist.',
      )

    return node as T
  }

  addChild(child: Node) {
    child.parent = this
    child.zIndexChanged.on(() => {
      this.children.sort((a, b) => a.globalZIndex - b.globalZIndex)
    })
    this.children.push(child)
    this.children.sort((a, b) => a.globalZIndex - b.globalZIndex)
    if (this.isStarted) {
      child.start()
    }
  }

  // Events
  zIndexChanged = new Event<[zIndex: number]>()
  drawed = new Event<[delta: number]>()
  updated = new Event<[delta: number]>()
  destroyed = new Event<[]>()

  start(): void {
    for (const child of this.children) {
      child.parent = this
      child.zIndexChanged.on(() => {
        this.children.sort((a, b) => a.globalZIndex - b.globalZIndex)
      })
    }
    this.isStarted = true
    this.children.sort((a, b) => a.globalZIndex - b.globalZIndex)

    for (const node of this.children) {
      node.start()
    }
  }
  update(delta: number): void {
    this.updated.emit(delta)
    for (const node of this.children) {
      node.update(delta)
    }
  }
  draw(delta: number): void {
    this.drawed.emit(delta)
    for (const node of this.children) {
      GameConfig.ctx.translate(this.position.x, this.position.y)
      GameConfig.translate.add(this.position)
      node.draw(delta)
      GameConfig.translate.subtract(this.position)
      GameConfig.ctx.translate(-this.position.x, -this.position.y)
    }
  }

  destroy() {
    if (this.isDestroyed) return

    const q = this.parent != null ? this.parent.children : []

    const index = q.indexOf(this)
    if (index < 0) return
    q.splice(index, 1)

    this.isDestroyed = true

    this.destroyed.emit()
    for (const node of this.children) {
      node.destroy()
    }
  }
}
