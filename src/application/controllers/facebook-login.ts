import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, badRequest, unauthorized, serverError, success } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }
      const result = await this.facebookAuth.perform({ token: httpRequest.token })

      if (result instanceof Error) {
        return unauthorized()
      }

      return success({
        accessToken: result.value
      })
    } catch (error) {
      const parsedError = error as Error
      return serverError(parsedError)
    }
  }
}
