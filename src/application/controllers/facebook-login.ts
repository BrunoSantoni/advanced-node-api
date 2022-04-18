import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, badRequest, unauthorized, serverError, success } from '@/application/helpers'
import { RequiredStringValidator, ValidationComposite } from '@/application/validations'

type HttpRequest = {
  // O token pode ser null ou undefined, mas se colocarmos no tipo aqui, o compilador vai reclamar lá embaixo
  // por isso, garantimos a validação nos testes
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)

      if (error !== undefined) {
        return badRequest(error)
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

  private validate (httpRequest: HttpRequest): Error | undefined {
    const requiredFieldValidator = new RequiredStringValidator(httpRequest.token, 'token')

    const validator = new ValidationComposite([requiredFieldValidator])

    return validator.validate()
  }
}
