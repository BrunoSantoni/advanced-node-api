import axios from 'axios'
import { HttpGetClient } from '@/infra/http'

jest.mock('axios')

class AxiosHttpClient {
  async get (args: HttpGetClient.Params): Promise<void> {
    await axios.get(args.url, {
      params: args.params
    })
  }
}

describe('AxiosHttpClient', () => {
  // Para uma classe que implementa várias interfaces, ter um describe para cada.
  describe('get', () => {
    it('should call get with correct params', async () => {
      const fakeAxios = axios as jest.Mocked<typeof axios>
      const sut = new AxiosHttpClient()

      await sut.get({
        url: 'any_url',
        params: {
          any: 'value'
        }
      })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
        params: {
          any: 'value'
        }
      })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
