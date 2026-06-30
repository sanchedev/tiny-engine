import { Plant } from '../enums/plants'

export const plantsInfo: Record<Plant, PlantInfo> = {
  [Plant.Peashooter]: {
    name: 'Peashooter',
    price: 4,
    seedCooldown: 7.5,
  },
}

interface PlantInfo {
  name: string
  price: number
  seedCooldown: number
}
