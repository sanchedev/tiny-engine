import { createContext } from 'tiny-engine/hooks'

export interface RowContext {
  projectilesLayer: string
  plantsLayer: string
  zombiesLayer: string
  rowIndex: number
}

export const RowCtx = createContext<RowContext>({
  projectilesLayer: 'projectile-??',
  plantsLayer: 'plant-??',
  zombiesLayer: 'zombie-??',
  rowIndex: -1,
})

export interface RowSpawnersContext {
  spawnProjectile(jsx: JSX.Element): void
  spawnPlant(jsx: JSX.Element): void
  spawnZombie(jsx: JSX.Element): void
}

export const RowSpawnersCtx = createContext<RowSpawnersContext>({
  spawnPlant() {},
  spawnProjectile() {},
  spawnZombie() {},
})
