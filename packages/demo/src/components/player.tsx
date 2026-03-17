import { kfFromSpriteSheet, loadTexture, Vector2 } from 'tiny-engine'
import { useEvent, useNode } from 'tiny-engine/hooks'

interface PlayerProps {
  initialPosition: Vector2
}

await loadTexture('player.idle', '/assets/sprites/player/idle.png')
await loadTexture('player.walk', '/assets/sprites/player/walk.png')
await loadTexture('player.lying', '/assets/sprites/player/lying.png')
await loadTexture('player.crawl', '/assets/sprites/player/crawl.png')
await loadTexture('player.jump', '/assets/sprites/player/jump.png')
await loadTexture('player.fall', '/assets/sprites/player/fall.png')

export function Player({ initialPosition }: PlayerProps) {
  const player = useNode('sprite')
  const animPlayer = useNode('animation-player')

  useEvent(
    () => {
      animPlayer
        .add('idle', {
          fps: 4,
          keyframes: kfFromSpriteSheet(player, 'player.idle', 4),
          loop: true,
        })
        .add('walk', {
          fps: 4,
          keyframes: kfFromSpriteSheet(player, 'player.walk', 4),
          loop: true,
        })
        .add('lying', {
          fps: 4,
          keyframes: kfFromSpriteSheet(player, 'player.lying', 4),
          loop: true,
        })
        .add('crawl', {
          fps: 4,
          keyframes: kfFromSpriteSheet(player, 'player.crawl', 4),
          loop: true,
        })
        .add('jump', {
          fps: 4,
          keyframes: kfFromSpriteSheet(player, 'player.jump', 2),
        })
        .add('fall', {
          fps: 4,
          keyframes: kfFromSpriteSheet(player, 'player.fall', 2),
        })

      animPlayer.play('idle')
    },
    () => player.started,
  )

  return (
    <sprite
      use={player}
      textureId='player.idle'
      position={initialPosition}
      size={new Vector2(64, 64)}>
      <animation-player use={animPlayer} />
    </sprite>
  )
}
