import type { Node } from '../nodes/node.js'

export class Scene {
  constructor(public render: () => Node) {}
}
