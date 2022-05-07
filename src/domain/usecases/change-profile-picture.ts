import { UploadFile, IDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'

type Input = { userId: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (
  fileStorage: UploadFile,
  idGenerator: IDGenerator,
  userProfileRepo: SaveUserPictureRepository & LoadUserProfileRepository
) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, idGenerator, userProfileRepo) => async ({ userId, file }) => {
  if (file === undefined) {
    const { name } = await userProfileRepo.loadProfile({ userId })
    let initials: string | undefined
    if (name !== undefined) {
      initials = generatePhraseInitials(name)
    }
    await userProfileRepo.savePicture({ initials })
    return
  }

  const uniqueId = idGenerator.uuid({ key: userId })
  const pictureUrl = await fileStorage.upload({ file, key: uniqueId })
  await userProfileRepo.savePicture({ pictureUrl })
}

const generatePhraseInitials = (phrase: string): string => {
  // Captura o primeiro caractere (.) depois de um espaço em branco (\b).
  const firstLetters = phrase.match(/\b(.)/g) ?? []

  if (firstLetters.length <= 1) {
    return phrase.substring(0, 2).toUpperCase()
  }

  return `${firstLetters.shift()?.toUpperCase() ?? ''}${firstLetters.pop()?.toUpperCase() ?? ''}`
}
