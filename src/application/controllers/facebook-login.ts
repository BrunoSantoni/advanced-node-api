import { HttpResponse, unauthorized, success } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validations'
import { BaseController } from '@/application/controllers'
import { FacebookAuthentication } from '@/domain/usecases'

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

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const { accessToken } = await this.facebookAuth({ token })

      return success({ accessToken })
    } catch {
      return unauthorized()
    }
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    const validators = ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()

    return validators
  }
}
