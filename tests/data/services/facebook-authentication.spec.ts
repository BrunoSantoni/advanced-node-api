import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: LoadFacebookUserApi
  let loadUserAccountRepo: LoadUserAccountRepository
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApi = {
      loadUser: jest.fn(async () => await Promise.resolve({
        name: 'any_fb_name',
        email: 'any_fb_email@mail.com',
        facebookId: 'any_fb_id'
      }))
    }
    loadUserAccountRepo = {
      load: jest.fn()
    }

    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadUserSpy = jest.spyOn(loadFacebookUserApi, 'loadUser')
    loadUserSpy.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    const loadSpy = jest.spyOn(loadUserAccountRepo, 'load')

    expect(loadSpy).toHaveBeenCalledWith({ email: 'any_fb_email@mail.com' })
    expect(loadSpy).toHaveBeenCalledTimes(1)
  })
})
