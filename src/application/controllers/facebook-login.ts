import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, unauthorized, success } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validations'
import { BaseController } from '@/application/controllers'

type HttpRequest = {
  // O token pode ser null ou undefined, mas se colocarmos no tipo aqui, o compilador vai reclamar lá embaixo
  // por isso, garantimos a validação nos testes
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends BaseController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) {
    super()
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuth.perform({ token: httpRequest.token })

    if (accessToken instanceof Error) {
      return unauthorized()
    }

    return success({
      accessToken: accessToken.value
    })
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
    const validators = ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()

    return validators
  }
}
