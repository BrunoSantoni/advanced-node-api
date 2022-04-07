import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveUserAccountByFacebookRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

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

  it('should create account with facebook data when LoadUserAccountRepo returns undefined', async () => {
    const saveWithFacebookSpy = jest.spyOn(userAccountRepo, 'saveWithFacebook')

    await sut.perform({ token })

    expect(saveWithFacebookSpy).toHaveBeenCalledWith(fakeUserAccount)
    expect(saveWithFacebookSpy).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateUserAccountByFacebookRepo when LoadUserAccountRepo returns data', async () => {
    const loadSpy = jest.spyOn(userAccountRepo, 'load')
    loadSpy.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    const saveWithFacebookSpy = jest.spyOn(userAccountRepo, 'saveWithFacebook')

    await sut.perform({ token })

    expect(saveWithFacebookSpy).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email@mail.com',
      facebookId: 'any_fb_id'
    })
    expect(saveWithFacebookSpy).toHaveBeenCalledTimes(1)
  })

  it('should update name even when UpdateUserAccountByFacebookRepo is called without name', async () => {
    const loadSpy = jest.spyOn(userAccountRepo, 'load')
    loadSpy.mockResolvedValueOnce({
      id: 'any_id'
    })

    const saveWithFacebookSpy = jest.spyOn(userAccountRepo, 'saveWithFacebook')

    await sut.perform({ token })

    expect(saveWithFacebookSpy).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email@mail.com',
      facebookId: 'any_fb_id'
    })
    expect(saveWithFacebookSpy).toHaveBeenCalledTimes(1)
  })
})
