import { _set_gc } from './game-config.js'
import { Game } from './game.js'

interface SetupOptions {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export function setup(options: SetupOptions) {
  _set_gc({
    canvas: options.canvas,
    ctx: options.ctx,
    width: options.canvas.width,
    height: options.canvas.height,
  })

  applyDPRToCanvas(options.ctx)
  options.ctx.imageSmoothingEnabled = false

  let shouldPause = false
  let lastTime = 0
  let wakeLock: WakeLockSentinel
  let handle = 0

  const update = (time: number) => {
    const delta = (time - lastTime) / 1000
    lastTime = time

    Game.loop(delta)

    if (shouldPause) return
    handle = window.requestAnimationFrame(update)
  }

  const pause = () => {
    shouldPause = true
    wakeLock?.release()
    if (document.fullscreenElement != null) {
      document.exitFullscreen()
    }
  }

  const onBlur = () => {
    pause()
    Game.blured.emit()
    window.cancelAnimationFrame(handle)
  }

  const transition = (time: number) => {
    shouldPause = false
    lastTime = time
    window.navigator.wakeLock.request('screen').then((w) => (wakeLock = w))

    window.addEventListener('blur', onBlur)

    handle = window.requestAnimationFrame(update)
  }

  const play = () => {
    window.requestAnimationFrame(transition)
  }

  return {
    play,
    pause,
  }
}

function applyDPRToCanvas(ctx: CanvasRenderingContext2D) {
  const dpr = window.devicePixelRatio ?? 1

  const { width, height } = ctx.canvas.getBoundingClientRect()
  const { width: canvasWidth, height: canvasHeight } = ctx.canvas

  ctx.canvas.width = width * dpr
  ctx.canvas.height = height * dpr

  const ratio = ctx.canvas.width / canvasWidth

  ctx.scale(ratio, ratio)

  return { width: canvasWidth, height: canvasHeight, ratio }
}
