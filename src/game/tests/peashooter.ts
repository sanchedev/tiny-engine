import { Game, Scene } from '../../canvas-engine/index.js'
import { Peashooter } from '../plants/peashooter.js'

const root = document.querySelector<HTMLElement>('#root')!

Game.setup({
  width: 160,
  height: 90,
  root,
})

const mainScene = new Scene(() => Peashooter())

Game.sceneManager.addScene('main', mainScene)
Game.sceneManager.setScene('main')

Game.play()
