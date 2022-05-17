import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/usecases'
import { makeUUIDGenerator, makeS3FileStorage } from '@/main/factories/gateways'
import { makePgUserProfileRepo } from '@/main/factories/repos'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  // Infra
  const s3FileStorage = makeS3FileStorage()
  const pgUserProfileRepo = makePgUserProfileRepo()

  const uuidGenerator = makeUUIDGenerator()

  // Data
  return setupChangeProfilePicture(s3FileStorage, uuidGenerator, pgUserProfileRepo)
}
