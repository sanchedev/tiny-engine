import { jsx } from '../jsx-runtime.js'
import type { TinyType } from '../jsx/types.js'
import { Node } from '../nodes/node.js'

type RenderComponent = TinyType | Promise<TinyType> | Node | Promise<Node>

/**
 * The **`Scene`** class creates scenes for the game.
 *
 *
 * @example
 * ```ts
 * // Scene without lazy loading
 * new Scene(
 *   async () => <MainScene />,
 * )
 * ```
 * ```ts
 * // Scene with lazy loading
 * new Scene(
 *   async () => (await import('./scenes/main.js')).default,
 * )
 * ```
 */
export class Scene {
  constructor(
    /** The **`render`** property is a function that returns a component. */
    public render: () => RenderComponent,
  ) {}

  /** The **`load`** method loads the component and assets. */
  async load() {
    const node = await this.render()

    if (node instanceof Node) return node

    return jsx(node, {})
  }
}
