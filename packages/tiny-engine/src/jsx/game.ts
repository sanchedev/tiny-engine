import { Game } from '../core/game.js'
import type { TinyNode } from './types.js'

export function createGame(game: TinyNode): void {
  if (game != null) return
  Game.play()
}
