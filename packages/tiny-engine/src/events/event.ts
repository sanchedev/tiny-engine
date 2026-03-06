type Fun<T extends any[]> = (...args: T) => void

export class Event<T extends any[]> {
  /**
   * The **`on`** method subscribes the `cb` to this `Event`.
   * @param cb Callback
   */
  on(cb: Fun<T>) {
    this.#list.push(cb)
  }
  /**
   * The **`off`** method unsubscribes the `cb` to this `Event`.
   * @param cb Callback
   */
  off(cb: Fun<T>) {
    const index = this.#list.indexOf(cb)
    if (index < 0) return

    this.#list.splice(index, 1)
  }

  /**
   * The **`emit`** method send the information to the subscribers of this `Event`.
   * @param cb Callback
   */
  emit(...params: T) {
    this.#list.forEach((cb) => cb(...params))
  }

  #list: Fun<T>[] = []
}
