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

// Para uma classe que implementa várias interfaces, ter um describe para cada.
describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object

  beforeAll(() => {
    url = 'any_url'
    params = { any: 'value' }
    fakeAxios = axios as jest.Mocked<typeof axios>
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    it('should call get with correct params', async () => {
      await sut.get({
        url,
        params
      })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, {
        params
      })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
