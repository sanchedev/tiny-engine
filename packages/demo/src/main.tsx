import { createGame } from 'tiny-engine'
import './nodes/index.js'

createGame(
  <game
    width={300}
    height={150}
    root={document.querySelector('#root')!}
    defaultScene='test'>
    <scene name='test' component={() => import('./scenes/test.js')} />
  </game>,
)
