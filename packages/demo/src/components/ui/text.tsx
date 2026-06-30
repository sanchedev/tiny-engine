import { loadTexture, type SignalGetter, type VectorLike } from 'tiny-engine'
import { useEffect, useRef } from 'tiny-engine/hooks'
import { List } from 'tiny-engine/jsx'

const CHARS = await loadTexture('/assets/sprites/ui/characters.png')

const textSizes = ['0123456789()¡!¿?.,;:', 'abcdefghijklmnopqrstuvwxyz']
const largers = '¿?mnw'

const calcPos = (char: string): [number, number] => {
  const row = textSizes.findIndex((r) => r.includes(char))
  if (row < 0) return [0, 0]
  const textRow = textSizes[row]!
  const index = textRow.indexOf(char)
  const maxW = largers
    .split('')
    .reduce(
      (p, c) => (textRow.slice(0, index).includes(c) ? p + 2 : p),
      index * 3,
    )

  return [maxW, 5 * row]
}

export function Text({
  text,
  position,
}: {
  text: SignalGetter<string>
  position: VectorLike
}) {
  const currentWidth = useRef(0)
  useEffect(() => {
    currentWidth.current = 0
    text()
  })
  return (
    <transform position={position}>
      <List array={() => text().split('')} itemKey={(val, i) => `${val}-${i}`}>
        {(c) => {
          const w = largers.includes(c) ? 5 : 3
          currentWidth.current += w + 1
          return (
            <sprite
              textureId={CHARS}
              position={[currentWidth.current - w - 1, 0]}
              sourceSize={[w, 5]}
              margin={calcPos(c)}
            />
          )
        }}
      </List>
    </transform>
  )
}
