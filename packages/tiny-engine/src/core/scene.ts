import { jsx, type TinyComponent } from '../jsx-runtime.js'
import { Node } from '../nodes/node.js'

type RenderComponent =
  | TinyComponent
  | Promise<TinyComponent>
  | Node
  | Promise<Node>

export class Scene {
  constructor(public render: () => RenderComponent) {}

  async load() {
    const node = await this.render()

    if (node instanceof Node) return node

    return jsx(node, {})
  }
}
