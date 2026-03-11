import { Collider, GameConfig, loadTexture, Vector2 } from 'tiny-engine'
import { useNode, useSignal } from 'tiny-engine/hooks'

await loadTexture('pea', 'assets/sprites/projectiles/pea.png')

const PEA_SPEED = 40

interface PeaProps {
  position: Vector2
}

export function Pea({ position }: PeaProps) {
  const pea = useNode('sprite')
  const peaPos = useSignal(position)

  const handleUpdate = (delta: number) => {
    if (pea.globalPosition.x <= GameConfig.width) {
      peaPos.value.x += delta * PEA_SPEED
    } else {
      pea.destroy()
    }
  }

  const handleColliderEnter = (collider: Collider) => {
    console.log(collider)
  }

  return (
    <sprite use={pea} textureId='pea' position={peaPos} onUpdate={handleUpdate}>
      <collider
        size={new Vector2(4, 4)}
        layer={['projectile']}
        mesh={['zombie']}
        onColliderEnter={handleColliderEnter}
      />
    </sprite>
  )
}
