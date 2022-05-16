import { SaveProfilePictureController, BaseController } from '@/application/controllers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validations'

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

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ file, userId })

    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
  })

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ file, userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({
      file,
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
