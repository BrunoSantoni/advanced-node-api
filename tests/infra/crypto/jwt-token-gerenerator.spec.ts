import jwt from 'jsonwebtoken'
import { TokenGenerator } from '@/data/contracts/crypto'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMinutes * 60

    jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds
    })
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
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
})
