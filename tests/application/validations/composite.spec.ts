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
  it('should return undefined if all Validators return undefined', () => {
    const firstValidator: Validator = {
      validate: jest.fn().mockReturnValue(undefined)
    }

    const secondValidator: Validator = {
      validate: jest.fn().mockReturnValue(undefined)
    }

    const validators = [firstValidator, secondValidator]

    const sut = new ValidationComposite(validators)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
