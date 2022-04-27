import { HttpResponse, badRequest, serverError } from '@/application/helpers'
import { ValidationComposite, Validator } from '@/application/validations'

// Classe abstrata não pode ser instanciada, só herdada
export abstract class BaseController {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  // Valor padrão será um array vazio para os controllers que não desejarem implementar
  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)

    if (error !== undefined) {
      return badRequest(error)
    }

    try {
      return await this.perform(httpRequest)
    } catch (error) {
      const parsedError = error as Error
      return serverError(parsedError)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)

    return new ValidationComposite(validators).validate()
  }
}
