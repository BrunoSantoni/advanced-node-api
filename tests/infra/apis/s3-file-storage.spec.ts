import { config } from 'aws-sdk'

jest.mock('aws-sdk')

class S3FileStorage {
  constructor (
    private readonly accessKey: string,
    private readonly secret: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }
}

describe('S3FileStorage', () => {
  let accessKey: string
  let secret: string

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
  })
  it('should config aws credentials on creation', () => {
    const sut = new S3FileStorage(accessKey, secret)

    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
})
