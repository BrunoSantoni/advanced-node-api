import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserApi: LoadFacebookUserApi
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApi: LoadFacebookUserApi = {
    loadUser: jest.fn()
  }
  const sut = new FacebookAuthenticationService(loadFacebookUserApi)

  return {
    sut,
    loadFacebookUserApi
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApi } = makeSut()

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut()

    const loadUserSpy = jest.spyOn(loadFacebookUserApi, 'loadUser')
    loadUserSpy.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
