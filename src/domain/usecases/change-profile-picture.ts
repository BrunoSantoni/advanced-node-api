import { UploadFile, IDGenerator } from '@/domain/contracts/gateways'

type Input = { userId: string, file: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, idGenerator: IDGenerator) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, idGenerator) => async ({ userId, file }) => {
  const uniqueId = idGenerator.uuid({ key: userId })
  await fileStorage.upload({ file, key: uniqueId })
}
