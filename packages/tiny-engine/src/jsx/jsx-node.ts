import {
  getNodeFromFuncComponent,
  isFuncComponent,
} from './cases/func-components.js'
import {
  getNodeFromintrinsicElement,
  isIntrinsicElement,
} from './cases/intrinsic-elements.js'
import { getNodeFromNodeClass, isNodeClass } from './cases/node-classes.js'
import type { JSXProps, JSXReturn, TinyType } from './types.js'

export function getJSXNode<T extends TinyType>(
  tiny: T,
  props: JSXProps<T>,
): JSXReturn<T> {
  if (isIntrinsicElement(tiny)) {
    return getNodeFromintrinsicElement(tiny, props) as JSXReturn<T>
  }
  if (isFuncComponent(tiny)) {
    return getNodeFromFuncComponent(tiny, props) as JSXReturn<T>
  }
  if (isNodeClass(tiny)) {
    return getNodeFromNodeClass(tiny, props) as JSXReturn<T>
  }

  throw new Error(`The type ${tiny} is not allowed.`)
}
