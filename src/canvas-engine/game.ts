import { SceneManager } from './classes/scene-manager.js'
import { _set_gc, GameConfig } from './game-config.js'
import { getDPRFromCtx } from './lib/dpr.js'
import { Event } from './lib/event.js'

interface SetupOptions {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
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
  static setup(options: SetupOptions) {
    if (setuped) return

    setuped = true
    _set_gc({
      canvas: options.canvas,
      ctx: options.ctx,
      width: options.canvas.width,
      height: options.canvas.height,
    })

    const { width: w, height: h, ratio: r } = getDPRFromCtx(options.ctx)
    options.canvas.width = w
    options.canvas.height = h
    options.ctx.scale(r, r)

    this.sceneManager.changeScene(null)
  }

  static pause() {
    isPaused = true
    wakeLock?.release()
  }

  static #update(time: number) {
    const delta = (time - lastTime) / 1000
    lastTime = time

    Game.loop(delta)

    if (isPaused) return
    handle = window.requestAnimationFrame(this.#update)
  }

  static #transition(time: number) {
    isPaused = false
    lastTime = time
    window.navigator.wakeLock.request('screen').then((w) => (wakeLock = w))

    window.addEventListener('blur', onBlur)

    handle = window.requestAnimationFrame(this.#update)
  }

  static play() {
    window.requestAnimationFrame(this.#transition)
  }

  static sceneManager = new SceneManager()

  static loop(delta: number) {
    const node = this.sceneManager.currentNode

    GameConfig.ctx.clearRect(0, 0, GameConfig.width, GameConfig.height)

    if (node == null) return

    node.update(delta)
    node.draw(delta)
  }

  static blured = new Event<[]>()
}
