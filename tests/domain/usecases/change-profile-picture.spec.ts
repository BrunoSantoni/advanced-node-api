import { UploadFile, IDGenerator } from '@/domain/contracts/gateways'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/usecases'

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

  it('should not call UploadFile when file is undefined', async () => {
    await sut({
      userId: 'any_id',
      file: undefined
    })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
})
