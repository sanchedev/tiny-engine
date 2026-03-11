import './nodes/index.js'

import { createGame, Game, Scene } from 'tiny-engine/jsx'

const game = createGame(
  <Game width={150} height={75} defaultScene='test'>
    <Scene name='test' component={() => import('./scenes/test.js')} />
  </Game>,
  document.querySelector('#root')!,
)

game.play()
