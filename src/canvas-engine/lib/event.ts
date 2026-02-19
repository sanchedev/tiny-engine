type Fun<T extends any[]> = (...args: T) => void

export class Event<T extends any[]> {
  on(cb: Fun<T>) {
    this.#list.push(cb)
  }
  off(cb: Fun<T>) {
    const index = this.#list.indexOf(cb)
    if (index < 0) return

    this.#list.splice(index, 1)
  }

  emit(params: T) {
    this.#list.forEach((cb) => cb(...params))
  }

  #list: Fun<T>[] = []
}
