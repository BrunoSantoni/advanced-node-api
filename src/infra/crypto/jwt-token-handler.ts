import { sign, verify, JwtPayload } from 'jsonwebtoken'
import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways'

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (
    private readonly secret: string
  ) {}

  async generate ({ expirationInMinutes, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMinutes * 60

    const token = sign({ key }, this.secret, {
      expiresIn: expirationInSeconds
    })

    return token
  }

  async validate ({ token }: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = verify(token, this.secret) as JwtPayload

    return payload.key
  }
}
