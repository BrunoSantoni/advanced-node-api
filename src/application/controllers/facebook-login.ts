import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, badRequest } from '@/application/helpers'
import { ServerError, RequiredFieldError } from '@/application/errors'

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
        return {
          statusCode: 401,
          data: result
        }
      }

      return {
        statusCode: 200,
        data: {
          accessToken: result.value
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          statusCode: 500,
          data: new ServerError(error)
        }
      }

      return {
        statusCode: 500,
        data: new ServerError()
      }
    }
  }
}
