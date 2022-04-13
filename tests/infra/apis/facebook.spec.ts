import { FacebookApi } from '@/infra/apis'
import { HttpGetClient } from '@/infra/http'

describe('FacebookApi', () => {
  let clientId: string
  let clientSecret: string

  let sut: FacebookApi
  let httpClient: HttpGetClient

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'

    httpClient = {
      get: jest.fn(async () => await Promise.resolve())
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new FacebookApi(clientId, clientSecret, httpClient)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
