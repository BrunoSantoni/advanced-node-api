import { UploadFile } from '@/domain/contracts/gateways'
import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

class S3FileStorage {
  constructor (
    accessKey: string,
    secret: string,
    private readonly bucket: string
  ) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }

  async upload ({ key, file }: UploadFile.Input): Promise<void> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()
  }
}

describe('S3FileStorage', () => {
  let sut: S3FileStorage

  let key: string
  let file: Buffer
  let accessKey: string
  let secret: string
  let bucket: string
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock

  beforeAll(() => {
    key = 'any_key'
    file = Buffer.from('any_file')
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bucket = 'any_bucket'

    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({
      promise: putObjectPromiseSpy
    }))
    jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
      putObject: putObjectSpy
    })))
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new S3FileStorage(accessKey, secret, bucket)
  })

  it('should config aws credentials on creation', () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })

  it('should call putObject with correct input', async () => {
    await sut.upload({ key, file })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })
})
