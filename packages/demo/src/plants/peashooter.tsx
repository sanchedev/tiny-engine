import {
  loadTexture,
  kfFromSpriteSheet,
  Vector2,
  useNode,
  useSpawn,
  useEvent,
} from 'tiny-engine'

import { Pea } from '../projectiles/pea.js'

await loadTexture(
  'peashooter.idle',
  'assets/sprites/plants/peashooter/idle.png',
)
await loadTexture(
  'peashooter.shoot',
  'assets/sprites/plants/peashooter/shoot.png',
)

export function Peashooter() {
  const { animPlayer, sprite } = usePeashooter()

  return (
    <entity>
      <sprite
        use={sprite}
        textureId='peashooter.idle'
        size={new Vector2(16, 16)}>
        <animation-player use={animPlayer} />
      </sprite>
    </entity>
  )
}

function usePeashooter() {
  const sprite = useNode('sprite')
  const animPlayer = useNode('animation-player')
  const projectilesContainer = useNode({
    nodeType: 'node',
    path: '/projectiles',
  })

  const spawnPea = useSpawn(projectilesContainer)

  useEvent(
    () => {
      animPlayer
        .add('idle', {
          fps: 4,
          keyframes: kfFromSpriteSheet(sprite, 'peashooter.idle', 4),
          loop: false,
        })
        .add('shoot', {
          fps: 4,
          keyframes: kfFromSpriteSheet(sprite, 'peashooter.shoot', 4),
          loop: false,
        })

      animPlayer.play('idle')
    },
    () => sprite.started,
  )

  useEvent(
    (anim) => {
      if (anim === 'idle') {
        animPlayer.play('shoot')
      } else {
        animPlayer.play('idle')
      }
    },
    () => animPlayer.animationEnded,
  )

  useEvent(
    (index) => {
      if (animPlayer.currentAnim === 'shoot' && index === 2) {
        spawnPea(
          <Pea position={sprite.globalPosition.toAdded(new Vector2(10, 8))} />,
        )
      }
    },
    () => animPlayer.animationIndexChanged,
  )

  return { sprite, animPlayer }
}
