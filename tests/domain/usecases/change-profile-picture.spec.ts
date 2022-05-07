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
      loadProfile: jest.fn(async () => await Promise.resolve({
        name: 'John Middle Doe'
      }))
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

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPictureRepository with correct input when file is undefined', async () => {
    await sut({
      userId: 'any_id',
      file: undefined
    })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'JD' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPictureRepository with uppercased initials when file is undefined', async () => {
    jest.spyOn(userProfileRepo, 'loadProfile')
      .mockResolvedValueOnce({ name: 'john lowercased doe' })

    await sut({
      userId: 'any_id',
      file: undefined
    })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'JD' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPictureRepository with first two letters of the name when file is undefined and user only have one name', async () => {
    jest.spyOn(userProfileRepo, 'loadProfile')
      .mockResolvedValueOnce({ name: 'john' })

    await sut({
      userId: 'any_id',
      file: undefined
    })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'JO' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPictureRepository with first letter of the name when file is undefined and user only have one letter in name field', async () => {
    jest.spyOn(userProfileRepo, 'loadProfile')
      .mockResolvedValueOnce({ name: 'j' })

    await sut({
      userId: 'any_id',
      file: undefined
    })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'J' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPictureRepository with undefined initials when file is undefined and name is undefined', async () => {
    jest.spyOn(userProfileRepo, 'loadProfile')
      .mockResolvedValueOnce({ name: undefined })

    await sut({
      userId: 'any_id',
      file: undefined
    })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: undefined })
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
