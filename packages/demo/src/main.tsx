import './nodes/index.js'

import { createGame, Game, Scene } from 'tiny-engine/jsx'

const game = createGame(
  <Game width={192 * 6} height={108 * 6} defaultScene='test'>
    <Scene name='test' component={() => import('./scenes/test.js')} />
  </Game>,
  document.querySelector('#root')!,
)

game.play()
