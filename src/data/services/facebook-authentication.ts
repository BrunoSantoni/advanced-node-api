import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveUserAccountByFacebookRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
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

    await this.userAccountRepo.saveWithFacebook({
      id: accountData?.id,
      name: accountData?.name ?? fbData.name,
      email: fbData.email,
      facebookId: fbData.facebookId
    })

    return new AuthenticationError()
  }
}
