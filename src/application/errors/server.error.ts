export class ServerError extends Error {
  constructor (error?: Error) {
    super('Internal Server Error, try again')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
