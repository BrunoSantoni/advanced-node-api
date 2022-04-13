import { LoadFacebookUserApi } from '@/data/contracts/apis'

class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly httpClient: HttpGetClient
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    return {
      facebookId: '123',
      name: 'John Doe',
      email: 'john_doe@mail.com'
    }
  }
}

namespace HttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

describe('FacebookApi', () => {
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'

  it('should get app token', async () => {
    const httpClient: HttpGetClient = {
      get: jest.fn(async () => await Promise.resolve())
    }

    const sut = new FacebookApi(clientId, clientSecret, httpClient)

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
