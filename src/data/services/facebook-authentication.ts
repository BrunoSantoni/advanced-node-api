import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveUserAccountByFacebookRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { TokenGenerator } from '@/data/contracts/crypto'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (
    private readonly crypto: TokenGenerator,
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveUserAccountByFacebookRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser({
      token: params.token
    })

    if (fbData === undefined) {
      return new AuthenticationError()
    }

    const accountData = await this.userAccountRepo.load({ email: fbData?.email })
    const fbAccount = new FacebookAccount(fbData, accountData)

    const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)

    await this.crypto.generateToken({ key: id })

    return new AuthenticationError()
  }
}
