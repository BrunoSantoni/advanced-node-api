import jwt from 'jsonwebtoken'
import { TokenGenerator } from '@/data/contracts/crypto'

jest.mock('jsonwebtoken')

class JwtTokenGenerator implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMinutes * 60

    const token = jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds
    })

    return token
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')

    secret = 'any_secret'
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new JwtTokenGenerator(secret)
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({
      key: 'any_key',
      expirationInMinutes: 1
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, secret, { expiresIn: 60 })
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
  })

  it('should return a token', async () => {
    const token = await sut.generateToken({
      key: 'any_key',
      expirationInMinutes: 1
    })

    expect(token).toBe('any_token')
  })

  it('should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('token_error')
    })

    const promise = sut.generateToken({
      key: 'any_key',
      expirationInMinutes: 1
    })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
