import { Game } from '../canvas-engine/index.js'

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

Game.setup({
  canvas,
  ctx,
})
Game.play()
