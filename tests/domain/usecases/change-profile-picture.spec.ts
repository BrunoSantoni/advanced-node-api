type Input = { userId: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile) => ChangeProfilePicture

const setupChangeProfilePicture: Setup = (fileStorage) => async ({ userId, file }) => {
  await fileStorage.upload({ file, key: userId })
}

export namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}
interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage: UploadFile = {
      upload: jest.fn(async () => await Promise.resolve())
    }
    const sut = setupChangeProfilePicture(fileStorage)

    await sut({
      userId: 'any_id',
      file
    })

    expect(fileStorage.upload).toHaveBeenCalledWith({
      file,
      key: 'any_id'
    })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
