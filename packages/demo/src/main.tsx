import './nodes/index.js'

import { Game } from 'tiny-engine'
import './scenes/test.js'

const root = document.querySelector<HTMLElement>('#root')!

Game.setup({
  width: 160,
  height: 90,
  root,
})

Game.sceneManager.setScene('test')

Game.play()
