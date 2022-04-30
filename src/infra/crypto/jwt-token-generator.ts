import { sign } from 'jsonwebtoken'
import { TokenGenerator } from '@/domain/contracts/crypto'

type Params = TokenGenerator.Params
type Result = TokenGenerator.Result

export class JwtTokenGenerator implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken ({ expirationInMinutes, key }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMinutes * 60

    const token = sign({ key }, this.secret, {
      expiresIn: expirationInSeconds
    })

    return token
  }
}
