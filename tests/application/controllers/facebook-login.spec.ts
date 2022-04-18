import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validations'

jest.mock('@/application/validations/required-string')

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: FacebookAuthentication
  let token: string

  beforeAll(() => {
    facebookAuth = {
      perform: jest.fn(async () => Promise.resolve(new AccessToken('any_value')))
    }

    token = 'any_token'
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new FacebookLoginController(facebookAuth)
  })

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')

    const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest.mocked(RequiredStringValidator).mockImplementationOnce(RequiredStringValidatorSpy)

    const httpResponse = await sut.handle({ token })

    expect(RequiredStringValidator).toHaveBeenCalledWith(token, 'token')
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth.perform).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    jest.spyOn(facebookAuth, 'perform').mockResolvedValueOnce(new UnauthorizedError())

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })

  it('should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    jest.spyOn(facebookAuth, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
