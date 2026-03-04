import { GameConfig } from '../../canvas-engine/game-config.js'
import { loadTexture } from '../../canvas-engine/load/textures.js'
import { Sprite, useNode } from '../../canvas-engine/nodes/index.js'

await loadTexture('pea', 'assets/sprites/projectiles/pea.png')

const PEA_SPEED = 40

export function Pea() {
  const { node, onUpdate } = useNode<Sprite>()

  onUpdate((node, delta) => {
    if (node.globalPosition.x <= GameConfig.width) {
      node.position.x += delta * PEA_SPEED
    } else {
      node.destroy()
    }
  })

  return node(
    new Sprite({
      textureId: 'pea',
    }),
  )
}
