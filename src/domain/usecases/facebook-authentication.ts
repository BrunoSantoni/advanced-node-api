import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { SaveUserAccountByFacebookRepository, LoadUserAccountRepository } from '@/domain/contracts/repos'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'

export type FacebookAuthentication = (params: { token: string }) => Promise<AccessToken | AuthenticationError>

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
    return new AuthenticationError()
  }

  const accountData = await userAccountRepo.load({ email: fbData?.email })
  const fbAccount = new FacebookAccount(fbData, accountData)

  const { id } = await userAccountRepo.saveWithFacebook(fbAccount)

  const generatedToken = await crypto.generateToken({
    key: id,
    expirationInMinutes: AccessToken.expirationInMinutes
  })

  return new AccessToken(generatedToken)
}
