import { BaseController } from '@/application/controllers'
import { HttpResponse, noContent } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/usecases'

type HttpRequest = { userId: string }

export class DeleteProfilePictureController extends BaseController {
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
