export namespace TokenValidator {
  export type Params = { token: string }
}

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<void>
}

type Input = { token: string }
export type Authorize = (params: Input) => Promise<void>
type Setup = (crypto: TokenValidator) => Authorize

const setupAuthorize: Setup = (crypto) => async ({ token }) => {
  await crypto.validateToken({ token })
}

describe('Authorize', () => {
  let crypto: TokenValidator
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = {
      validateToken: jest.fn(async () => Promise.resolve())
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
})
