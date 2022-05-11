import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse } from '@/application/helpers'

type HttpRequest = {
  file: { buffer: Buffer, mimeType: string }
}
type Model = Error

class InvalidMymeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupported type. Allowed types: ${allowed.join(', ')}`)
    this.name = 'InvalidMymeTypeError'
  }
}

class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`FIle upload limit is ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}

class SaveProfilePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if (file === undefined || file === null) {
      return badRequest(new RequiredFieldError('file'))
    }
    if (file.buffer.length === 0) {
      return badRequest(new RequiredFieldError('file'))
    }
    if (file.buffer.length > 5 * 1024 * 1024) {
      return badRequest(new MaxFileSizeError(5))
    }
    if (!['image/png', 'image/jpg', 'image.jpeg'].includes(file.mimeType)) {
      return badRequest(new InvalidMymeTypeError(['png', 'jpg']))
    }
  }
}

describe('SaveProfilePictureController', () => {
  let sut: SaveProfilePictureController

  let buffer: Buffer
  let mimeType: string

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
  })

  beforeEach(() => {
    sut = new SaveProfilePictureController()
  })

  it('should return 400 if file is undefined', async () => {
    const httpResponse = await sut.handle({
      file: undefined as any
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is null', async () => {
    const httpResponse = await sut.handle({
      file: null as any
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({
      file: {
        buffer: Buffer.from(''),
        mimeType
      }
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({
      file: {
        buffer,
        mimeType: 'invalid_mimetype'
      }
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError([
        'png',
        'jpg'
      ])
    })
  })

  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({
      file: {
        buffer,
        mimeType
      }
    })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError([
        'png',
        'jpg'
      ])
    })
  })

  it('should return 400 if file size is bigger than 5MB', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.handle({
      file: {
        buffer: invalidBuffer,
        mimeType
      }
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
  })
})