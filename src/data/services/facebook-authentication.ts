import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateUserAccountByFacebookRepository, LoadUserAccountRepository, UpdateUserAccountByFacebookRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateUserAccountByFacebookRepository & UpdateUserAccountByFacebookRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser({
      token: params.token
    })

    if (fbData === undefined) {
      return new AuthenticationError()
    }

    const accountData = await this.userAccountRepo.load({ email: fbData?.email })

    accountData?.name !== undefined
      ? await this.userAccountRepo.updateWithFacebook({
        id: accountData.id,
        name: accountData.name,
        facebookId: fbData.facebookId
      })
      : await this.userAccountRepo.createFromFacebook(fbData)

    return new AuthenticationError()
  }
}
