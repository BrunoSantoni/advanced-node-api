import { FacebookLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validations'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: jest.Mock
  let token: string

  beforeAll(() => {
    facebookAuth = jest.fn(async () => Promise.resolve({
      accessToken: 'any_value'
    }))

    token = 'any_token'
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new FacebookLoginController(facebookAuth)
  })

  it('should build Validators correctly', () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([new RequiredStringValidator(token, 'token')])
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    facebookAuth.mockRejectedValueOnce(new UnauthorizedError())

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
})
