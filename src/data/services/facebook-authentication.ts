import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateUserAccountByFacebookRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createUserAccountByFacebookRepo: CreateUserAccountByFacebookRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser({
      token: params.token
    })

    if (fbData === undefined) {
      return new AuthenticationError()
    }

    await this.loadUserAccountRepo.load({ email: fbData?.email })
    await this.createUserAccountByFacebookRepo.createFromFacebook(fbData)

    return new AuthenticationError()
  }
}
