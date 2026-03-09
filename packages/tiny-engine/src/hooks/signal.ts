import { Signal } from '../reactivity/signal.js'

export function useSignal<T>(initialValue: T) {
  return new Signal(initialValue)
}
