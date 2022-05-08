import { UploadFile, IDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Input = { userId: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (
  fileStorage: UploadFile,
  idGenerator: IDGenerator,
  userProfileRepo: SaveUserPictureRepository & LoadUserProfileRepository
) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, idGenerator, userProfileRepo) => async ({ userId, file }) => {
  const data: { pictureUrl?: string, name?: string } = {}
  const uniqueId = idGenerator.uuid({ key: userId })
  if (file === undefined) {
    data.name = (await userProfileRepo.loadProfile({ userId })).name
  } else {
    data.pictureUrl = await fileStorage.upload({ file, key: uniqueId })
  }

  const userProfile = new UserProfile(userId)
  userProfile.setPicture(data)
  await userProfileRepo.savePicture(userProfile)
}
