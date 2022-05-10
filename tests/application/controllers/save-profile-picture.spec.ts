import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse } from '@/application/helpers'

type HttpRequest = {
  file: any
}
type Model = Error

class SaveProfilePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError('file'))
  }
}

describe('SaveProfilePictureController', () => {
  let sut: SaveProfilePictureController

  beforeEach(() => {
    sut = new SaveProfilePictureController()
  })

  it('should return 400 if file is undefined', async () => {
    const httpResponse = await sut.handle({
      file: undefined
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is null', async () => {
    const httpResponse = await sut.handle({
      file: null
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})
