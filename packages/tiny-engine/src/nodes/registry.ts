import type { Node } from './node.js'
import type {
  NodeClasses,
  NodeName,
  NodesOptions,
  NodeToOptions,
} from './types.js'

export const Nodes: NodeClasses = {} as NodeClasses

/**
 * The **`getNode`** function is used to create an instance of a node based on its name and options. It retrieves the node class from the registry and creates an instance of it using the provided options.
 * @param nodeName - The name of the node to create an instance of.
 * @param options - The options to pass to the node constructor when creating an instance of the node.
 * @returns An instance of the node corresponding to the provided node name and options.
 */
export function getNode<T extends NodeName>(
  nodeName: T,
  options: NodesOptions[T],
) {
  return getNodeFromClass(Nodes[nodeName], options)
}

export function getNodeFromClass<T extends typeof Node>(
  nodeClass: T,
  props: NodeToOptions<T>,
): InstanceType<T> {
  return new nodeClass(props) as InstanceType<T>
}

/**
 * The **`registerNode`** function is used to register a node class in the registry under a specific node name. This allows the node to be created later using the `getNode` function by referencing its name.
 * @param nodeName - The name under which to register the node class in the registry.
 * @param nodeClass - The class of the node to register.
 *
 * @example
 * ```ts
 * // my-node.ts
 * interface MyNodeOptions extends NodeOptions {
 *   // Node options
 * }
 *
 * class MyNode extends Node {
 *   constructor(options: MyNodeOptions) {
 *    super(options)
 *    // Node initialization
 *   }
 *   // Node implementation
 * }
 *
 * // registry.ts
 * declare module 'tiny-engine' {
 *   interface NodeClasses {
 *     entity: typeof MyNode
 *   }
 * }
 *
 * registerNode('myNode', MyNode)
 *
 * ```
 */
export function registerNode<T extends NodeName>(
  nodeName: T,
  nodeClass: NodeClasses[T],
) {
  Nodes[nodeName] = nodeClass
}
