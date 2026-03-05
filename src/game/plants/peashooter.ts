import { Vector2 } from '../../canvas-engine/index.js'
import { useAdd, addStart } from '../../canvas-engine/lib/adds/index.js'
import { kfSpriteSheet } from '../../canvas-engine/lib/animation.js'
import { loadTexture } from '../../canvas-engine/load/textures.js'
import {
  AnimationPlayer,
  Node,
  Sprite,
} from '../../canvas-engine/nodes/index.js'
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
  const add = useAdd<Sprite>()

  addStart((node) => {
    const animPlayer = node.getChild<AnimationPlayer>('animation-player')
    const peaContainer = node.getChild<Node>('pea-container')

    animPlayer
      .add('idle', {
        fps: 4,
        keyframes: kfSpriteSheet(node, 'peashooter.idle', 4),
        loop: false,
      })
      .add('shoot', {
        fps: 4,
        keyframes: kfSpriteSheet(node, 'peashooter.shoot', 4),
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
        peaContainer.addChild(Pea())
      }
    })

    animPlayer.play('idle')
  }, add.adds)

  return add.toNode(
    new Sprite({
      textureId: 'peashooter.idle',
      size: new Vector2(16, 16),
      children: [
        new AnimationPlayer({}),
        new Node({
          id: 'pea-container',
          position: new Vector2(10, 8),
        }),
      ],
    }),
  )
}
