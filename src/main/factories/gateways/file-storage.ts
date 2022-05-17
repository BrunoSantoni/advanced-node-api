import { S3FileStorage } from '@/infra/sdks'
import { env } from '@/main/config/env'

export const makeS3FileStorage = (): S3FileStorage => {
  return new S3FileStorage(env.s3.accessKey, env.s3.secret, env.s3.bucket)
}
