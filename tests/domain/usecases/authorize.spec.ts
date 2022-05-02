export namespace TokenValidator {
  export type Params = { token: string }
  export type Result = string
}

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<TokenValidator.Result>
}

type Input = { token: string }
type Output = string
export type Authorize = (params: Input) => Promise<Output>
type Setup = (crypto: TokenValidator) => Authorize

const setupAuthorize: Setup = (crypto) => async ({ token }) => {
  const key = await crypto.validateToken({ token })

  return key // Key will be userId
}

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
