import { MaxFileSizeError } from '@/application/errors'
import { MaxFileSize } from '@/application/validations'

describe('Max File Size', () => {
  let invalidBuffer: Buffer
  let validBuffer: Buffer

  beforeAll(() => {
    invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    validBuffer = Buffer.from(new ArrayBuffer(5 * 1024 * 1024))
  })

  it('should return MaxFileSize error if value is invalid', () => {
    const sut = new MaxFileSize(5, invalidBuffer)
    const error = sut.validate()

    expect(error).toEqual(new MaxFileSizeError(5))
  })

  it('should return undefined if buffer size is valid', () => {
    const sut = new MaxFileSize(5, validBuffer)
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
