import { sign, verify } from 'jsonwebtoken'
import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'

export class JwtTokenHandler implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken ({ expirationInMinutes, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMinutes * 60

    const token = sign({ key }, this.secret, {
      expiresIn: expirationInSeconds
    })

    return token
  }

  async validateToken ({ token }: TokenValidator.Params): Promise<void> {
    verify(token, this.secret)
  }
}