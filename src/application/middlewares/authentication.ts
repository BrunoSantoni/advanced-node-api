import { Authorize } from '@/domain/usecases'
import { HttpResponse, success, forbidden } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validations'

type HttpRequest = {
  authorization: string
}

type Model = Error | {
  userId: string
}

export class AuthenticationMiddleware {
  constructor (
    private readonly authorize: Authorize
  ) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!this.validate({ authorization })) return forbidden()

    try {
      const userId = await this.authorize({ token: authorization })

      return success({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()

    return error === undefined
  }
}
