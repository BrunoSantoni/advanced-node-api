import { MaxFileSizeError } from '@/application/errors'

export class MaxFileSize {
  constructor (
    private readonly maxFileSizeInMb: number,
    private readonly receivedBuffer: Buffer
  ) {}

  validate (): Error | undefined {
    const maxFileSizeInBytes = this.maxFileSizeInMb * 1024 * 1024
    if (this.receivedBuffer.length > maxFileSizeInBytes) {
      return new MaxFileSizeError(this.maxFileSizeInMb)
    }
  }
}
