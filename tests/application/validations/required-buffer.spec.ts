import { RequiredFieldError } from '@/application/errors'
import { RequiredBuffer, Required } from '@/application/validations'

describe('RequiredBuffer', () => {
  it('should extend required', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'))

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return RequiredFieldError if buffer is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''))

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError())
  })

  it('should return undefined is value is not empty', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'), 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
