import { Vector2 } from 'tiny-engine'
import { Player } from '../components/player'

export default function Test() {
  return (
    <node>
      <Player initialPosition={Vector2.ZERO} />
    </node>
  )
}
