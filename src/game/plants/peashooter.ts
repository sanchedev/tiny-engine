import { Vector2 } from '../../canvas-engine/index.js'
import { loadTexture } from '../../canvas-engine/load/textures.js'
import {
  kfFromProp,
  multiKF,
} from '../../canvas-engine/nodes/animation-player.js'
import {
  AnimationPlayer,
  Node,
  Sprite,
  useNode,
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
  const { node, onStart } = useNode<Sprite>()

  onStart((node) => {
    const animPlayer = node.getChild<AnimationPlayer>('animation-player')
    const peaContainer = node.getChild<Node>('pea-container')

    animPlayer
      .add('idle', {
        fps: 4,
        keyframes: [
          multiKF([
            kfFromProp(node, 'textureId', 'peashooter.idle'),
            kfFromProp(node, 'margin', new Vector2(0, 0)),
          ]),
          kfFromProp(node, 'margin', new Vector2(16, 0)),
          kfFromProp(node, 'margin', new Vector2(32, 0)),
          kfFromProp(node, 'margin', new Vector2(48, 0)),
        ],
        loop: false,
      })
      .add('shoot', {
        fps: 4,
        keyframes: [
          multiKF([
            kfFromProp(node, 'textureId', 'peashooter.shoot'),
            kfFromProp(node, 'margin', new Vector2(0, 0)),
          ]),
          kfFromProp(node, 'margin', new Vector2(16, 0)),
          kfFromProp(node, 'margin', new Vector2(32, 0)),
          kfFromProp(node, 'margin', new Vector2(48, 0)),
        ],
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
        console.log(peaContainer.children)
      }
    })

    animPlayer.play('idle')
  })

  return node(
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
