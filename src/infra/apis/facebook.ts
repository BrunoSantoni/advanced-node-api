import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { HttpGetClient } from '@/infra/http/client'

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly httpClient: HttpGetClient
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const { access_token: accessToken } = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    const debugToken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/debug_token`,
      params: {
        access_token: accessToken,
        input_token: params.token
      }
    })

    await this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: params.token
      }
    })

    return {
      facebookId: '123',
      name: 'John Doe',
      email: 'john_doe@mail.com'
    }
  }
}
