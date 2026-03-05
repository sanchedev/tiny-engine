import { Game, Scene, Vector2 } from '../../canvas-engine/index.js'
import { Text, View } from '../../canvas-engine/nodes/ui/index.js'

const root = document.querySelector<HTMLElement>('#root')!

Game.setup({
  width: 160,
  height: 90,
  root,
})

const mainScene = new Scene(() => {
  return new View({
    position: new Vector2(20, 20),
    size: new Vector2(20, 20),
    children: [
      new Text({
        text: 'Hola',
        width: 20,
        fontSize: 4,
      }),
    ],
  })
})

Game.sceneManager.addScene('main', mainScene)
Game.sceneManager.setScene('main')

Game.play()
