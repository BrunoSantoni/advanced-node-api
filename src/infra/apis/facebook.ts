import { LoadFacebookUser } from '@/domain/contracts/gateways'
import { HttpGetClient } from '@/infra/http/client'

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type UserInfo = {
  id: string
  name: string
  email: string
}

type Params = LoadFacebookUser.Params
type Result = LoadFacebookUser.Result

export class FacebookApi implements LoadFacebookUser {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly httpClient: HttpGetClient
  ) {}

  async loadUser ({ token }: Params): Promise<Result> {
    return this.getUserInfo(token)
      .then(({ id, name, email }) => ({ facebookId: id, name, email }))
      .catch(() => undefined)
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpClient.get<AppToken>({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const { access_token: accessToken } = await this.getAppToken()

    return this.httpClient.get<DebugToken>({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: accessToken,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const { data: { user_id: userId } } = await this.getDebugToken(clientToken)

    return this.httpClient.get<UserInfo>({
      url: `${this.baseUrl}/${userId}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
