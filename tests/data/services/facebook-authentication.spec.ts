import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveUserAccountByFacebookRepository } from '@/data/contracts/repos'
import { TokenGenerator } from '@/data/contracts/crypto'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'

jest.mock('@/domain/models/facebook-account')

const fakeUserAccount = ({
  name: 'any_fb_name',
  email: 'any_fb_email@mail.com',
  facebookId: 'any_fb_id'
})

describe('FacebookAuthenticationService', () => {
  let crypto: TokenGenerator
  let facebookApi: LoadFacebookUserApi
  let userAccountRepo: LoadUserAccountRepository & SaveUserAccountByFacebookRepository
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    crypto = {
      generateToken: jest.fn(async () => await Promise.resolve('any_generated_token'))
    }

    facebookApi = {
      loadUser: jest.fn(async () => await Promise.resolve(fakeUserAccount))
    }
    userAccountRepo = {
      load: jest.fn(async () => await Promise.resolve(undefined)),
      saveWithFacebook: jest.fn(async () => await Promise.resolve(
        { id: 'any_account_id' }
      ))
    }

    sut = new FacebookAuthenticationService(
      crypto,
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

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email@mail.com' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    // Reescrevendo implementação do construtor
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      ...fakeUserAccount
    }))
    jest.mocked(FacebookAccount).mockImplementationOnce(FacebookAccountStub)

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith(fakeUserAccount)
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMinutes: AccessToken.expirationInMinutes
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    const generateTokenSpy = jest.spyOn(crypto, 'generateToken')
    generateTokenSpy.mockRejectedValueOnce(new Error('crypto_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('crypto_error'))
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    const loadUserSpy = jest.spyOn(facebookApi, 'loadUser')
    loadUserSpy.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    const loadSpy = jest.spyOn(userAccountRepo, 'load')
    loadSpy.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if SaveUserAccountByFacebookRepository throws', async () => {
    const saveWithFacebookSpy = jest.spyOn(userAccountRepo, 'saveWithFacebook')
    saveWithFacebookSpy.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
