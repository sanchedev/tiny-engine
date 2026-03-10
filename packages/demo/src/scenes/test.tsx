import { Game, Scene, sceneRender } from 'tiny-engine'

Game.sceneManager.addScene(
  'test',
  sceneRender(async () => (await import('../envs/one.js')).OneEnv),
)
