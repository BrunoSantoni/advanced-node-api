import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/usecases'

type HttpRequest = {
  file: { buffer: Buffer, mimeType: string }
  userId: string
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
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {}

  async handle ({ file, userId }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
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

    await this.changeProfilePicture({
      file: file.buffer,
      userId
    })
  }
}

describe('SaveProfilePictureController', () => {
  let sut: SaveProfilePictureController
  let changeProfilePicture: jest.Mock

  let userId: string
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }

  beforeAll(() => {
    changeProfilePicture = jest.fn()

    userId = 'any_user_id'
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = {
      buffer,
      mimeType
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new SaveProfilePictureController(changeProfilePicture)
  })

  it('should return 400 if file is undefined', async () => {
    const httpResponse = await sut.handle({
      file: undefined as any, userId
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is null', async () => {
    const httpResponse = await sut.handle({
      file: null as any, userId
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
      },
      userId
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
      },
      userId
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
      },
      userId
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
      },
      userId
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
  })

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ file, userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({
      file: file.buffer,
      userId
    })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
})
