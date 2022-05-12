import {
  AllowedMimeTypes,
  MaxFileSize,
  Required,
  RequiredBuffer,
  RequiredString,
  ValidationBuilder
} from '@/application/validations'

describe('ValidationBuilder', () => {
  it('should return RequiredString if received value is string', () => {
    const validators = ValidationBuilder.of({
      value: 'any_value',
      fieldName: 'any_name'
    }).required().build()

    expect(validators).toEqual([
      new RequiredString('any_value', 'any_name')
    ])
  })

  it('should return RequiredBuffer if received value is Buffer', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({ value: buffer }).required().build()

    expect(validators).toEqual([
      new RequiredBuffer(buffer)
    ])
  })

  it('should return Required if received value is object', () => {
    const object = {
      any_key: 'any_value'
    }

    const validators = ValidationBuilder.of({ value: object }).required().build()

    expect(validators).toEqual([
      new Required(object)
    ])
  })

  it('should return Required if received value is a buffer object', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({ value: { buffer } }).required().build()

    expect(validators).toEqual([
      new Required({ buffer }),
      new RequiredBuffer(buffer)
    ])
  })

  it('should return MaxFileSize if mimetype is not provided', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .image({
        allowed: ['png', 'jpg'],
        maxSizeInMb: 10
      })
      .build()

    expect(validators).toEqual([
      new MaxFileSize(10, buffer)
    ])
  })

  it('should return AllowedMimeTypes if buffer is not provided', () => {
    const mimeType = 'image/png'

    const validators = ValidationBuilder
      .of({ value: { mimeType } })
      .image({
        allowed: ['png', 'jpg'],
        maxSizeInMb: 10
      })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['png', 'jpg'], mimeType)
    ])
  })

  it('should return AllowedMimeTypes and MaxFileSize if buffer and mimetype exists in object', () => {
    const buffer = Buffer.from('any_buffer')
    const mimeType = 'image/png'

    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType } })
      .image({
        allowed: ['png', 'jpg'],
        maxSizeInMb: 10
      })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(10, buffer)
    ])
  })
})
