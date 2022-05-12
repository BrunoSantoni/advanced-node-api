import { HttpResponse, success } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/usecases'
import { BaseController } from '@/application/controllers'
import { ValidationBuilder, Validator } from '@/application/validations'

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
    const pictureData = await this.changeProfilePicture({
      file: file.buffer,
      userId
    })

    return success(pictureData)
  }

  override buildValidators ({ file }: HttpRequest): Validator[] {
    const validators = ValidationBuilder.of({ value: file, fieldName: 'file' })
      .required()
      .image({
        allowed: ['png', 'jpg'],
        maxSizeInMb: 5
      })
      .build()

    return validators
  }
}
