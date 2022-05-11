import { InvalidMimeTypeError } from '@/application/errors'

type Allowed = 'png' | 'jpg'

class AllowedMimeTypes {
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

describe('Allowed MimeTypes', () => {
  let sut: AllowedMimeTypes

  beforeEach(() => {
    sut = new AllowedMimeTypes(['png'], 'image/jpg')
  })

  it('should return InvalidMimeType error if value is invalid', () => {
    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })

  it('should return undefined if value is png', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/png')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return undefined if value is jpg', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpg')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return undefined if value is jpeg', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpeg')
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
