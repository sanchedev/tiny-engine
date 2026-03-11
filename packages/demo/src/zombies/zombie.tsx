import { loadTexture, Vector2 } from 'tiny-engine'
import { useSignal } from 'tiny-engine/hooks'

await loadTexture('zombie.walk', 'assets/sprites/zombies/zombie/walk.png')

export function Zombie() {
  const zombiePos = useSignal(new Vector2(128, 0))

  const handleUpdate = (delta: number) => {
    zombiePos.value.x -= delta * 10
  }

  return (
    <sprite
      textureId='zombie.walk'
      size={new Vector2(16, 16)}
      position={zombiePos}
      onUpdate={handleUpdate}>
      <collider size={new Vector2(16, 16)} layer={['zombie']} mesh={[]} />
    </sprite>
  )
}
