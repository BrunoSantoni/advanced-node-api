import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { SaveUserAccountByFacebookRepository, LoadUserAccountRepository } from '@/domain/contracts/repos'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'

type Input = { token: string }
type Output = { accessToken: string }

export type FacebookAuthentication = (params: Input) => Promise<Output>

type Setup = (
  crypto: TokenGenerator,
  facebookApi: LoadFacebookUserApi,
  userAccountRepo: LoadUserAccountRepository & SaveUserAccountByFacebookRepository
) => FacebookAuthentication

export const setupFacebookAuthentication: Setup = (crypto, facebookApi, userAccountRepo) => async ({ token }) => {
  const fbData = await facebookApi.loadUser({
    token
  })

  if (fbData === undefined) {
    throw new AuthenticationError()
  }

  const accountData = await userAccountRepo.load({ email: fbData?.email })
  const fbAccount = new FacebookAccount(fbData, accountData)

  const { id } = await userAccountRepo.saveWithFacebook(fbAccount)

  const generatedToken = await crypto.generateToken({
    key: id,
    expirationInMinutes: AccessToken.expirationInMinutes
  })

  return {
    accessToken: generatedToken
  }
}
