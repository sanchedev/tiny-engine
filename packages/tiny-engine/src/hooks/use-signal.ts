import { Signal } from '../reactivity/signal.js'
import { pushEffect } from './context.js'

export function useSignal<T>(initialValue: T) {
  pushEffect('useSignal', () => {})
  return new Signal(initialValue)
}
