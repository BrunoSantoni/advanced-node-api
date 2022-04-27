import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook API Integration Tests', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(env.facebookApi.clientId, env.facebookApi.clientSecret, axiosClient)

    /* Token gerado pelo facebook developers expira depois de 3 meses: 27/07/22 */
    const fbUser = await sut.loadUser({ token: 'EAAXHrbQOgwoBAFJdJkgmDtSQcsZAEZB7gFcbMnWJ7S170Aj3pCxwLJEWOWlr7shnCAoiudAqUYJA2DojVsxYBSBuEGy39WlRzGsKx3yGb5TosZBUOTF8oapECGGfUuZCk9LMjc3y78wAkBhQiptfaZAtuMcI8CFX9aGjcI19JZCpbrLBM8xxUvqAlgO6ECW9rp7gUla3Lw6avxRqaVXIdR' })

    expect(fbUser).toEqual({
      facebookId: '114830901207161',
      email: 'bruno_ajqkeit_teste@tfbnw.net',
      name: 'Bruno Teste'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(env.facebookApi.clientId, env.facebookApi.clientSecret, axiosClient)

    /* Token gerado pelo facebook developers expira depois de 3 meses: 27/07/22 */
    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBeUndefined()
  })
})
