import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { SaveUserAccountByFacebookRepository, LoadUserAccountRepository } from '@/domain/contracts/repos'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken, FacebookAccount } from '@/domain/entities'

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor (
    private readonly crypto: TokenGenerator,
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveUserAccountByFacebookRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser({
      token: params.token
    })

    if (fbData === undefined) {
      return new AuthenticationError()
    }

    const accountData = await this.userAccountRepo.load({ email: fbData?.email })
    const fbAccount = new FacebookAccount(fbData, accountData)

    const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)

    const token = await this.crypto.generateToken({
      key: id,
      expirationInMinutes: AccessToken.expirationInMinutes
    })

    return new AccessToken(token)
  }
}