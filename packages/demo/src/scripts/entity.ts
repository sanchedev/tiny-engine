import { PrimaryNode } from 'tiny-engine'
import { TinyScript } from 'tiny-engine/scripts'

export abstract class EntityScript extends TinyScript<PrimaryNode.Transform> {
  abstract health: number

  applyDamage(damage: number) {
    this.health -= damage
    if (this.health <= 0) {
      this.me.destroy()
      return true
    }
    return false
  }
}
