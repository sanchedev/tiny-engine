import {
  loadTexture,
  useAdd,
  Sprite,
  addStart,
  AnimationPlayer,
  kfFromSpriteSheet,
  Vector2,
  Node,
  useLoad,
} from 'tiny-engine'

import { Pea } from '../projectiles/pea.js'

function load() {
  console.log('load')
  return [
    loadTexture('peashooter.idle', 'assets/sprites/plants/peashooter/idle.png'),
    loadTexture(
      'peashooter.shoot',
      'assets/sprites/plants/peashooter/shoot.png',
    ),
  ]
}

export function Peashooter() {
  useLoad(load)
  const add = useAdd<Sprite>()

  addStart((node) => {
    console.log('start')
    const animPlayer = node.getChild<AnimationPlayer>('animation-player')
    const peaContainer = node.getChild<Node>('pea-container')

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
        peaContainer.addChild(Pea())
      }
    })

    animPlayer.play('idle')
  }, add.adds)

  return add.toNode(
    <Sprite textureId='peashooter.idle' size={new Vector2(16, 16)}>
      <AnimationPlayer id='animation-player' />
      <Node id='pea-container' position={new Vector2(10, 8)} />
    </Sprite>,
  )
}
