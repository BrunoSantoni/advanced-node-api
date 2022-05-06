import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { SaveUserAccountByFacebookRepository, LoadUserAccountRepository } from '@/domain/contracts/repos'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'

type Input = { token: string }
type Output = { accessToken: string }

export type FacebookAuthentication = (params: Input) => Promise<Output>

type Setup = (
  crypto: TokenGenerator,
  facebook: LoadFacebookUser,
  userAccountRepo: LoadUserAccountRepository & SaveUserAccountByFacebookRepository
) => FacebookAuthentication

export const setupFacebookAuthentication: Setup = (tokenHandler, facebook, userAccountRepo) => async ({ token }) => {
  const fbData = await facebook.loadUser({
    token
  })

  if (fbData === undefined) {
    throw new AuthenticationError()
  }

  const accountData = await userAccountRepo.load({ email: fbData?.email })
  const fbAccount = new FacebookAccount(fbData, accountData)

  const { id } = await userAccountRepo.saveWithFacebook(fbAccount)

  const generatedToken = await tokenHandler.generate({
    key: id,
    expirationInMinutes: AccessToken.expirationInMinutes
  })

  return {
    accessToken: generatedToken
  }
}
