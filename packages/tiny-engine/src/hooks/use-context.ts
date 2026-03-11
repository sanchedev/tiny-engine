import { Fragment } from '../jsx/components/fragment.js'
import type { Tiny } from '../jsx/types.js'
import { currentContext, pushEffect } from './context.js'

const contexts: Map<number, ContextCreated<any>> = new Map()

export function createContext<T>(defaultValue: T) {
  return new ContextCreated<T>(defaultValue)
}

export function useContext<T>(
  contextCreated: ContextCreated<T>,
): Context<T> | undefined {
  let context: Context<T> | {} = {}

  pushEffect('useContext', (_, currentContext) => {
    context =
      currentContext.find((h) => h.context?.id === contextCreated.__id)
        ?.context ?? {}
  })

  return new Proxy<Context<T>>(context as Context<T>, {
    set() {
      return false
    },
    get(_, key) {
      if (context == null) return undefined

      if (key === 'get' || key === 'set')
        return (context as Context<T>)[key].bind(context as Context<T>)
      return undefined
    },
  })
}

class ContextCreated<T> {
  __id: number
  #defaultValue: T

  constructor(defaultValue: T) {
    this.#defaultValue = defaultValue
    this.__id = genContextId()
    contexts.set(this.__id, this)
  }

  Provider = (props: Tiny.WithChildren) => {
    const def = this.#defaultValue
    const ctx = currentContext.at(-1)
    if (ctx) {
      ctx.context = new Context(def, this.__id)
    }
    return Fragment(props)
  }
}

export class Context<T> {
  #value: T

  set(value: T) {
    this.#value = value
  }
  get() {
    return this.#value
  }

  constructor(
    defaultValue: T,
    public id: number,
  ) {
    this.#value = defaultValue
  }
}

function genContextId() {
  const key = Math.max(0, ...contexts.keys()) + 1

  return key
}
