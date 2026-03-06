import {
  GameConfig,
  loadTexture,
  addUpdate,
  useAdd,
  Sprite,
  addStart,
} from 'tiny-engine'

await loadTexture('pea', 'assets/sprites/projectiles/pea.png')

const PEA_SPEED = 40

export function Pea() {
  const add = useAdd<Sprite>()

  addStart((node) => {
    console.log(node)
  }, add.adds)
  addUpdate((node, delta) => {
    if (node.globalPosition.x <= GameConfig.width) {
      node.position.x += delta * PEA_SPEED
    } else {
      node.destroy()
    }
  }, add.adds)

  return add.toNode(<Sprite textureId='pea' />)
}
