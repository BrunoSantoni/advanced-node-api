import { InvalidMimeTypeError } from '@/application/errors'
import { Validator } from '@/application/validations'

export type Allowed = 'png' | 'jpg'

export class AllowedMimeTypes implements Validator {
  constructor (
    private readonly allowed: Allowed[],
    private readonly mimeType: string
  ) {}

  validate (): Error | undefined {
    let isValid = false

    if (this.isPng() || this.isJpg()) {
      isValid = true
    }

    if (!isValid) {
      return new InvalidMimeTypeError(this.allowed)
    }
  }

  private isPng (): boolean {
    return this.allowed.includes('png') && this.mimeType === 'image/png'
  }

  private isJpg (): boolean {
    return this.allowed.includes('jpg') && /image\/jpe?g/.test(this.mimeType)
  }
}
