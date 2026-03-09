export class TinyEngineError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TinyEngineError'
  }
}
