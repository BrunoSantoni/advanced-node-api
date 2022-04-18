import { ValidationComposite, Validator } from '@/application/validations'

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

  it('should return the first error', () => {
    jest.spyOn(firstValidator, 'validate').mockReturnValueOnce(new Error('first_error'))
    jest.spyOn(secondValidator, 'validate').mockReturnValueOnce(new Error('second_error'))

    const error = sut.validate()

    expect(error).toEqual(new Error('first_error'))
  })

  it('should return the error', () => {
    jest.spyOn(secondValidator, 'validate').mockReturnValueOnce(new Error('second_error'))

    const error = sut.validate()

    expect(error).toEqual(new Error('second_error'))
  })
})
