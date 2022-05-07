import { UploadFile, IDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/usecases'

describe('ChangeProfilePicture', () => {
  let fakeUuid: string
  let fakeFile: Buffer
  let fileStorage: UploadFile
  let idGenerator: IDGenerator
  let userProfileRepo: SaveUserPictureRepository & LoadUserProfileRepository
  let sut: ChangeProfilePicture

  beforeAll(() => {
    fakeUuid = 'any_unique_id'
    fakeFile = Buffer.from('any_buffer')
    fileStorage = {
      upload: jest.fn(async () => await Promise.resolve('any_url'))
    }
    idGenerator = {
      uuid: jest.fn(() => 'any_unique_id')
    }
    userProfileRepo = {
      savePicture: jest.fn(async () => await Promise.resolve()),
      loadProfile: jest.fn(async () => await Promise.resolve())
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = setupChangeProfilePicture(fileStorage, idGenerator, userProfileRepo)
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

  it('should call SaveUserPictureRepository with correct input', async () => {
    await sut({
      userId: 'any_id',
      file: fakeFile
    })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: 'any_url',
      initials: undefined
    })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPictureRepository with correct input when file is undefined', async () => {
    await sut({
      userId: 'any_id',
      file: undefined
    })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call LoadUserProfileRepository with correct input', async () => {
    await sut({
      userId: 'any_id',
      file: undefined
    })

    expect(userProfileRepo.loadProfile).toHaveBeenCalledWith({
      userId: 'any_id'
    })
    expect(userProfileRepo.loadProfile).toHaveBeenCalledTimes(1)
  })

  it('should not call LoadUserProfileRepository if file exists', async () => {
    await sut({
      userId: 'any_id',
      file: fakeFile
    })

    expect(userProfileRepo.loadProfile).not.toHaveBeenCalled()
  })
})
