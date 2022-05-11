import { InvalidMimeTypeError } from '@/application/errors'

type Allowed = 'png' | 'jpg'

class AllowedMimeTypes {
  constructor (
    private readonly allowed: Allowed[],
    private readonly mimeType: string
  ) {}

  validate (): Error {
    return new InvalidMimeTypeError(this.allowed)
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
})
