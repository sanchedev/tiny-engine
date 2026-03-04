import { SceneManager } from './classes/scene-manager.js'
import { _set_gc, GameConfig } from './game-config.js'
import { getDPRFromCtx } from './lib/dpr.js'
import { Event } from './lib/event.js'

interface SetupOptions {
  width: number
  height: number
  root: HTMLElement
}

let isPaused = false
let lastTime = 0
let wakeLock: WakeLockSentinel
let handle = 0
let setuped = false

const onBlur = () => {
  if (isPaused) return

  Game.pause()
  Game.blured.emit()
  window.cancelAnimationFrame(handle)
}

export class Game {
  static sceneManager = new SceneManager()

  static setup(options: SetupOptions) {
    if (setuped) return

    const canvas = document.createElement('canvas')

    options.root.append(canvas)

    const ctx = canvas.getContext('2d')

    if (ctx == null) throw new Error('Context 2D is not supported.')

    setuped = true
    _set_gc({
      canvas: canvas,
      ctx: ctx,
      width: options.width,
      height: options.height,
    })

    canvas.width = options.width
    canvas.height = options.height

    options.root.style.setProperty('--width', canvas.width.toString())
    options.root.style.setProperty('--height', canvas.height.toString())

    const { width: w, height: h, ratio: r } = getDPRFromCtx(ctx)
    canvas.width = w
    canvas.height = h
    ctx.scale(r, r)

    ctx.imageSmoothingEnabled = false

    this.sceneManager.setScene(null)
  }

  static play() {
    window.requestAnimationFrame(this.#transition)
  }

  static pause() {
    isPaused = true
    wakeLock?.release()
  }

  static #transition = (time: number) => {
    isPaused = false
    lastTime = time
    window.navigator.wakeLock.request('screen').then((w) => (wakeLock = w))

    window.addEventListener('blur', onBlur)

    handle = window.requestAnimationFrame(this.#update)
  }

  static #update = (time: number) => {
    const delta = (time - lastTime) / 1000
    lastTime = time

    Game.loop(delta)

    if (isPaused) return
    handle = window.requestAnimationFrame(this.#update)
  }

  static loop(delta: number) {
    const node = this.sceneManager.currentNode

    GameConfig.ctx.clearRect(0, 0, GameConfig.width, GameConfig.height)

    if (node == null) return

    if (!node.isStarted) {
      node.start()
    }

    node.update(delta)
    node.draw(delta)
  }

  static blured = new Event<[]>()
}
