import { Peashooter } from '../plants/peashooter.js'
import { Zombie } from '../zombies/zombie.js'

export default function Test() {
  return (
    <node>
      <node id='projectiles' />
      <Peashooter />
      <Zombie />
    </node>
  )
}
