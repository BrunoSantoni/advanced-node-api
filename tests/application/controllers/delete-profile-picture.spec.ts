import { ChangeProfilePicture } from '@/domain/usecases'
import { HttpResponse, noContent } from '@/application/helpers'
import { BaseController } from '@/application/controllers'

type HttpRequest = { userId: string }

class DeleteProfilePictureController extends BaseController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {
    super()
  }

  async perform ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({
      userId
    })

    return noContent()
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

  it('should extend BaseController', () => {
    expect(sut).toBeInstanceOf(BaseController)
  })

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({
      userId: 'any_user_id'
    })

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  it('should return 204 on success', async () => {
    const httpResponse = await sut.handle({
      userId: 'any_user_id'
    })

    expect(httpResponse).toEqual({ statusCode: 204, data: null })
  })
})
