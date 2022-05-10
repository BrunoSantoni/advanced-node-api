import { ChangeProfilePicture } from '@/domain/usecases'

type HttpRequest = { userId: string }

class DeleteProfilePictureController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {}

  async handle ({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture({
      userId
    })
  }
}

describe('DeleteProfilePictureController', () => {
  let sut: DeleteProfilePictureController
  let changeProfilePicture: ChangeProfilePicture

  beforeAll(() => {
    changeProfilePicture = jest.fn()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new DeleteProfilePictureController(changeProfilePicture)
  })

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({
      userId: 'any_user_id'
    })

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
})
