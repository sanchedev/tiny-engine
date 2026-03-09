import {
  GameConfig,
  loadTexture,
  useNode,
  useSignal,
  Vector2,
} from 'tiny-engine'

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

  return (
    <sprite
      use={pea}
      textureId='pea'
      position={peaPos}
      onUpdate={handleUpdate}
    />
  )
}
