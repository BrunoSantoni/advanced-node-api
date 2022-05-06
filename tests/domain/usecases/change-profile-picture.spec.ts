type Input = { userId: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, idGenerator: IDGenerator) => ChangeProfilePicture

const setupChangeProfilePicture: Setup = (fileStorage, idGenerator) => async ({ userId, file }) => {
  const uniqueId = idGenerator.uuid({ key: userId })
  await fileStorage.upload({ file, key: uniqueId })
}

export namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}
interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

export namespace IDGenerator {
  export type Input = { key: string }
  export type Output = string
}
interface IDGenerator {
  uuid: (input: IDGenerator.Input) => IDGenerator.Output
}

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const uuid = 'any_unique_id'
    const file = Buffer.from('any_buffer')
    const fileStorage: UploadFile = {
      upload: jest.fn(async () => await Promise.resolve())
    }
    const idGenerator: IDGenerator = {
      uuid: jest.fn(() => 'any_unique_id')
    }
    const sut = setupChangeProfilePicture(fileStorage, idGenerator)

    await sut({
      userId: 'any_id',
      file
    })

    expect(fileStorage.upload).toHaveBeenCalledWith({
      file,
      key: uuid
    })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
