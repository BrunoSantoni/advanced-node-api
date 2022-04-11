import { mocked } from 'ts-jest/utils'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveUserAccountByFacebookRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'

jest.mock('@/domain/models/facebook-account')

const fakeUserAccount = ({
  name: 'any_fb_name',
  email: 'any_fb_email@mail.com',
  facebookId: 'any_fb_id'
})

describe('FacebookAuthenticationService', () => {
  let facebookApi: LoadFacebookUserApi
  let userAccountRepo: LoadUserAccountRepository & SaveUserAccountByFacebookRepository
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    facebookApi = {
      loadUser: jest.fn(async () => await Promise.resolve(fakeUserAccount))
    }
    userAccountRepo = {
      load: jest.fn(async () => await Promise.resolve(undefined)),
      saveWithFacebook: jest.fn()
    }

    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadUserSpy = jest.spyOn(facebookApi, 'loadUser')
    loadUserSpy.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    const loadSpy = jest.spyOn(userAccountRepo, 'load')

    expect(loadSpy).toHaveBeenCalledWith({ email: 'any_fb_email@mail.com' })
    expect(loadSpy).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    // Reescrevendo implementação do construtor
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      ...fakeUserAccount
    }))
    mocked(FacebookAccount).mockImplementationOnce(FacebookAccountStub)

    const saveWithFacebookSpy = jest.spyOn(userAccountRepo, 'saveWithFacebook')

    await sut.perform({ token })

    expect(saveWithFacebookSpy).toHaveBeenCalledWith(fakeUserAccount)
    expect(saveWithFacebookSpy).toHaveBeenCalledTimes(1)
  })
})
