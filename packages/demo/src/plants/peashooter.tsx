import { loadTexture, kfFromSpriteSheet, Vector2, useStart } from 'tiny-engine'

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
  useStart<'sprite'>((node) => {
    const animPlayer = node.getChild('animation-player')
    const peaContainer = node.getChild('pea-container', 'node')

    animPlayer
      .add('idle', {
        fps: 4,
        keyframes: kfFromSpriteSheet(node, 'peashooter.idle', 4),
        loop: false,
      })
      .add('shoot', {
        fps: 4,
        keyframes: kfFromSpriteSheet(node, 'peashooter.shoot', 4),
        loop: false,
      })

    animPlayer.animationEnded.on((anim) => {
      if (anim === 'idle') {
        animPlayer.play('shoot')
      } else {
        animPlayer.play('idle')
      }
    })

    animPlayer.animationIndexChanged.on((index) => {
      if (animPlayer.currentAnim === 'shoot' && index === 2) {
        peaContainer.addChild(<Pea />)
      }
    })

    animPlayer.play('idle')
  })

  return (
    <sprite textureId='peashooter.idle' size={new Vector2(16, 16)}>
      <animation-player id='animation-player' />
      <node id='pea-container' position={new Vector2(10, 8)} />
    </sprite>
  )
}
