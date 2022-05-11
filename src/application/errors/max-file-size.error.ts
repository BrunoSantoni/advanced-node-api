export class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`FIle upload limit is ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}
