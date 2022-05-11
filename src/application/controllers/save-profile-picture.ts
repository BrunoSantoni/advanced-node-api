import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse, success } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/usecases'
import { BaseController } from '@/application/controllers'

type HttpRequest = {
  file: { buffer: Buffer, mimeType: string }
  userId: string
}
type Model = Error | { initials?: string, pictureUrl?: string }

export class SaveProfilePictureController extends BaseController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {
    super()
  }

  async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
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
      return badRequest(new InvalidMimeTypeError(['png', 'jpg']))
    }

    const pictureData = await this.changeProfilePicture({
      file: file.buffer,
      userId
    })

    return success(pictureData)
  }
}
