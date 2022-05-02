import { Authorize, setupAuthorize } from '@/domain/usecases'
import { TokenValidator } from '@/domain/contracts/crypto'

describe('Authorize', () => {
  let crypto: TokenValidator
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = {
      validateToken: jest.fn(async () => Promise.resolve('any_value'))
    }
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('should call TokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  it('should return the correct accessToken', async () => {
    const userId = await sut({ token })

    expect(userId).toBe('any_value')
  })
})
