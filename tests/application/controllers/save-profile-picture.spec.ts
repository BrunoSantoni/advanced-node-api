import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'
import { SaveProfilePictureController, BaseController } from '@/application/controllers'

describe('SaveProfilePictureController', () => {
  let sut: SaveProfilePictureController
  let changeProfilePicture: jest.Mock

  let userId: string
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }

  beforeAll(() => {
    changeProfilePicture = jest.fn().mockResolvedValue({
      initials: 'any_initials',
      pictureUrl: 'any_url'
    })

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

  it('should extend BaseController', () => {
    expect(sut).toBeInstanceOf(BaseController)
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
      data: new InvalidMimeTypeError([
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
      data: new InvalidMimeTypeError([
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

  it('should return 200 with valid data', async () => {
    const httpResponse = await sut.handle({ file, userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        initials: 'any_initials',
        pictureUrl: 'any_url'
      }
    })
  })
})
