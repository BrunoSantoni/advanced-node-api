import { UploadFile, IDGenerator, DeleteFile } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Input = { userId: string, file?: { buffer: Buffer, mimeType: string} }
type Output = { pictureUrl?: string, initials?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>
type Setup = (
  fileStorage: UploadFile & DeleteFile,
  idGenerator: IDGenerator,
  userProfileRepo: SaveUserPictureRepository & LoadUserProfileRepository
) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, idGenerator, userProfileRepo) => async ({ userId, file }) => {
  const uniqueId = idGenerator.uuid({ key: userId })
  const data = {
    pictureUrl: file !== undefined ? await fileStorage.upload({ file: file.buffer, fileName: `${uniqueId}.${file.mimeType.split('/')[1]}` }) : undefined,
    name: file === undefined ? (await userProfileRepo.loadProfile({ userId }))?.name : undefined
  }

  const userProfile = new UserProfile(userId)
  userProfile.setPicture(data)

  try {
    await userProfileRepo.savePicture(userProfile)
  } catch (error) {
    if (file !== undefined) {
      await fileStorage.delete({ fileName: uniqueId })
    }

    throw error
  }

  return {
    pictureUrl: userProfile.pictureUrl,
    initials: userProfile.initials
  }
}
