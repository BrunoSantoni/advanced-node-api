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
  let fakeUuid: string
  let fakeFile: Buffer
  let fileStorage: UploadFile
  let idGenerator: IDGenerator
  let sut: ChangeProfilePicture

  beforeAll(() => {
    fakeUuid = 'any_unique_id'
    fakeFile = Buffer.from('any_buffer')
    fileStorage = {
      upload: jest.fn(async () => await Promise.resolve())
    }
    idGenerator = {
      uuid: jest.fn(() => 'any_unique_id')
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = setupChangeProfilePicture(fileStorage, idGenerator)
  })

  it('should call UploadFile with correct input', async () => {
    await sut({
      userId: 'any_id',
      file: fakeFile
    })

    expect(fileStorage.upload).toHaveBeenCalledWith({
      file: fakeFile,
      key: fakeUuid
    })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
