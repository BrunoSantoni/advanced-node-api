interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite {
  constructor (
    private readonly validators: Validator[]
  ) {}

  validate (): undefined {
    return undefined
  }
}

describe('ValidationComposite', () => {
  let sut: ValidationComposite
  let firstValidator: Validator
  let secondValidator: Validator
  let validators: Validator[]

  beforeAll(() => {
    firstValidator = {
      validate: jest.fn().mockReturnValue(undefined)
    }

    secondValidator = {
      validate: jest.fn().mockReturnValue(undefined)
    }

    validators = [firstValidator, secondValidator]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })

  it('should return undefined if all Validators return undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
