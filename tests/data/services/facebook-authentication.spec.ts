import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: LoadFacebookUserApi
  let sut: FacebookAuthenticationService
  beforeEach(() => {
    loadFacebookUserApi = {
      loadUser: jest.fn()
    }

    sut = new FacebookAuthenticationService(loadFacebookUserApi)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadUserSpy = jest.spyOn(loadFacebookUserApi, 'loadUser')
    loadUserSpy.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
