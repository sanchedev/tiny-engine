import { Vector2, type VectorLike } from 'tiny-engine'
import { Row } from './row.js'
import { BoardCtx } from '../../contexts/board.js'
import { useRef, useSignal } from 'tiny-engine/hooks'
import type { InRowProps } from '../types.js'
import { SunCounter } from '../sun/sun-counter.js'
import { SunCountCtx } from '../../contexts/sun-count.js'
import { PlantSeed } from '../seeds/plant.js'
import { Plant } from '../../lib/enums/plants.js'
import { List } from 'tiny-engine/jsx'

interface BoardProps {
  position: VectorLike
  cellsCount: VectorLike
  cellSize: VectorLike
}

export function Board({ position, cellsCount, cellSize }: BoardProps) {
  const plantSpawners = useRef<
    ((colIndex: number, Comp: (props: InRowProps) => JSX.Element) => void)[]
  >([])

  const sunCounter = useSignal(1)

  return (
    <BoardCtx.Provider
      value={{
        cellSize: Vector2.vectorize(cellSize),
        cellsCount: Vector2.vectorize(cellsCount),
        spawnPlant(rowIndex, colIndex, Comp) {
          plantSpawners.current[rowIndex]?.(colIndex, Comp)
        },
      }}>
      <SunCountCtx.Provider value={sunCounter}>
        <SunCounter position={[12, 4]} />
        <transform position={[12, 16]}>
          <List array={[Plant.Peashooter]} itemKey={(p) => p.toString()}>
            {(plant, i) => <PlantSeed position={[0, i * 16]} plant={plant} />}
          </List>
        </transform>
        <transform position={position}>
          {Array.from({ length: 1 }, (_, i) => (
            <Row
              registerSpawners={(plants) => {
                plantSpawners.current.push(plants)
              }}
              rowIndex={i}
            />
          ))}
        </transform>
      </SunCountCtx.Provider>
    </BoardCtx.Provider>
  )
}
