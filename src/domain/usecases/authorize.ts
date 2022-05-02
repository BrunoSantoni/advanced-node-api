import { TokenValidator } from '@/domain/contracts/crypto'

type Input = { token: string }
type Output = string
export type Authorize = (params: Input) => Promise<Output>
type Setup = (crypto: TokenValidator) => Authorize

export const setupAuthorize: Setup = (crypto) => async ({ token }) => {
  const key = await crypto.validateToken({ token })

  return key // Key will be userId
}
