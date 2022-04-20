import { RequiredStringValidator, Validator } from '@/application/validations'

/* Builder facilita a criação de um objeto complexo. Pode fazer passando os
parâmetros no construtor ou gerando a instância através de um método estático. */
export class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of (params: { value: string, fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.value, this.fieldName))

    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
