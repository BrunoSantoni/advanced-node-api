import { UploadFile, IDGenerator } from '@/domain/contracts/gateways'
import { SaveUserPictureRepository } from '@/domain/contracts/repos'

type Input = { userId: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (
  fileStorage: UploadFile,
  idGenerator: IDGenerator,
  userProfileRepo: SaveUserPictureRepository
) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, idGenerator, userProfileRepo) => async ({ userId, file }) => {
  if (file === undefined) {
    await userProfileRepo.savePicture({ pictureUrl: undefined })
    return
  }

  const uniqueId = idGenerator.uuid({ key: userId })
  const pictureUrl = await fileStorage.upload({ file, key: uniqueId })
  await userProfileRepo.savePicture({ pictureUrl })
}
