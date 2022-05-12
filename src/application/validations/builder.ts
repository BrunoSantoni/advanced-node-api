import {
  Allowed,
  AllowedMimeTypes,
  MaxFileSize,
  Required,
  RequiredBuffer,
  RequiredString,
  Validator
} from '@/application/validations'

/* Builder facilita a criação de um objeto complexo. Pode fazer passando os
parâmetros no construtor ou gerando a instância através de um método estático. */
export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName?: string,
    private readonly validators: Validator[] = []
  ) {}

  static of (params: { value: any, fieldName?: string }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  required (): ValidationBuilder {
    if (this.value instanceof Buffer) {
      this.validators.push(new RequiredBuffer(this.value, this.fieldName))
    } else if (typeof this.value === 'string') {
      this.validators.push(new RequiredString(this.value, this.fieldName))
    } else if (typeof this.value === 'object') {
      this.validators.push(new Required(this.value, this.fieldName))

      if (this.value.buffer !== undefined) {
        this.validators.push(new RequiredBuffer(this.value.buffer, this.fieldName))
      }
    }

    return this
  }

  // YAGNI, se no futuro tiver um caso onde só precise de um ou outro transforma em opcionais
  image ({ allowed, maxSizeInMb }: { allowed: Allowed[], maxSizeInMb: number }): ValidationBuilder {
    if (this.value.mimeType !== undefined) {
      this.validators.push(new AllowedMimeTypes(allowed, this.value.mimeType))
    }

    if (this.value.buffer !== undefined) {
      this.validators.push(new MaxFileSize(maxSizeInMb, this.value.buffer))
    }

    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
