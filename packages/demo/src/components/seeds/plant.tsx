import { loadTexture, PrimaryNode, Vector2, type VectorLike } from 'tiny-engine'
import { Plant } from '../../lib/enums/plants'
import { PlantComponents } from '../../lib/components/plants'
import {
  useComputed,
  useContext,
  useRefNode,
  useSignal,
} from 'tiny-engine/hooks'
import { BoardCtx } from '../../contexts/board'
import { plantsInfo } from '../../lib/info/plants'
import { SunCountCtx } from '../../contexts/sun-count'

export function PlantSeed({
  plant,
  position,
}: {
  plant: Plant
  position?: VectorLike
}) {
  const { spawnPlant } = useContext(BoardCtx)
  const [sunCount] = useContext(SunCountCtx)
  const timer = useRefNode(PrimaryNode.Timer)

  const [hover, setHover] = useSignal(false)
  const [loaded, setLoaded] = useSignal(false)
  const [time, setTime] = useSignal(0)

  const progress = useComputed(() => time() / plantsInfo[plant].seedCooldown)

  const disabled = useComputed(
    () => !loaded() || sunCount() < plantsInfo[plant].price,
  )

  const brightness = useComputed(() => (hover() ? 1.1 : 1))
  const grayscale = useComputed(() => (disabled() ? 0.75 : 0))
  const sourceSize = useComputed(() => new Vector2(24, (1 - progress()) * 16))

  const handleClick = () => {
    spawnPlant(0, 2, PlantComponents[plant])
    setLoaded(false)
    timer.node.play()
  }

  return (
    <sprite
      textureId={PLANT_SEEDS[plant]}
      position={position}
      brightness={brightness}
      grayscale={grayscale}>
      <sprite
        textureId={PLANT_SEEDS[plant]}
        grayscale={1}
        brightness={0.75}
        sourceSize={sourceSize}
      />
      <clickable
        size={[18, 14]}
        position={[3, 1]}
        onMouseEnter={() => setHover(true)}
        onMouseExit={() => setHover(false)}
        onClick={handleClick}
        disabled={disabled}
      />
      <timer
        ref={timer}
        duration={plantsInfo[plant].seedCooldown}
        onTimeChange={setTime}
        onTimeout={() => setLoaded(true)}
        autoPlay
      />
    </sprite>
  )
}

const PLANT_SEEDS: Record<Plant, symbol> = {
  [Plant.Peashooter]: await loadTexture('/assets/sprites/seeds/peashooter.png'),
}
