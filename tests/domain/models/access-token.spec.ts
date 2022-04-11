import { AccessToken } from '@/domain/models'

describe('AccessToken', () => {
  it('should create with a value', () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({
      value: 'any_value'
    })
  })

  it('should expire in 30 minutes', () => {
    expect(AccessToken.expirationInMinutes).toBe(30)
  })
})
