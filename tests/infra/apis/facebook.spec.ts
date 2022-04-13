import { LoadFacebookUserApi } from '@/data/contracts/apis'

class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: HttpGetClient
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`
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
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

describe('FacebookApi', () => {
  it('should get app token', async () => {
    const httpClient: HttpGetClient = {
      get: jest.fn(async () => await Promise.resolve())
    }

    const sut = new FacebookApi(httpClient)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token'
    })
  })
})
