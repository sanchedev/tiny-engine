import { Game } from '../canvas-engine/game.js'

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

Game.setup({
  canvas,
  ctx,
})
Game.play()
