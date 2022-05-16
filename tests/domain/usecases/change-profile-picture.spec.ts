import { UploadFile, IDGenerator, DeleteFile } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/usecases'
import { UserProfile } from '@/domain/entities'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }
  let fileStorage: UploadFile & DeleteFile
  let idGenerator: IDGenerator
  let userProfileRepo: SaveUserPictureRepository & LoadUserProfileRepository
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
    fileStorage = {
      upload: jest.fn(async () => await Promise.resolve('any_url')),
      delete: jest.fn(async () => await Promise.resolve())
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

  it('should call UploadFile with correct input passing png image', async () => {
    await sut({
      userId: 'any_id',
      file: {
        buffer,
        mimeType: 'image/png'
      }
    })

    expect(fileStorage.upload).toHaveBeenCalledWith({
      file: buffer,
      fileName: `${uuid}.png`
    })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should call UploadFile with correct input passing jpeg image', async () => {
    await sut({
      userId: 'any_id',
      file: {
        buffer,
        mimeType: 'image/jpeg'
      }
    })

    expect(fileStorage.upload).toHaveBeenCalledWith({
      file: buffer,
      fileName: `${uuid}.jpeg`
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
      file
    })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...jest.mocked(UserProfile).mock.instances)
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPictureRepository even when loadProfile returns undefined', async () => {
    jest.spyOn(userProfileRepo, 'loadProfile').mockResolvedValueOnce(undefined)
    await sut({
      userId: 'any_id',
      file
    })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...jest.mocked(UserProfile).mock.instances)
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
      file
    })

    expect(userProfileRepo.loadProfile).not.toHaveBeenCalled()
  })

  it('should return correct data on success', async () => {
    jest.mocked(UserProfile).mockImplementationOnce(id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))

    const result = await sut({
      userId: 'any_id',
      file
    })

    // Embora no código não teremos nenhum caso que retorne tanto pictureUrl quanto initials,
    // O teste é para garantir que o retorno é o mesmo que o UserProfile, e não quais campos,
    // Essa validação de retornar um ou outro cabe aos testes unitários do UserProfile.
    expect(result).toEqual({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })

  it('should call DeleteFile when file exists and SaveUserPictureRepository throws', async () => {
    jest.spyOn(userProfileRepo, 'savePicture').mockRejectedValueOnce(new Error('any_error'))
    expect.assertions(2) // Tem que ter 2 expects no final

    const promise = sut({
      userId: 'any_id',
      file
    })

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({
        fileName: uuid
      })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  it('should not call DeleteFile when file does not exists and SaveUserPictureRepository throws', async () => {
    jest.spyOn(userProfileRepo, 'savePicture').mockRejectedValueOnce(new Error('any_error'))
    expect.assertions(1) // Tem que ter 1 expect no final

    const promise = sut({
      userId: 'any_id',
      file: undefined
    })

    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })

  it('should rethrow when SaveUserPicture throws', async () => {
    const error = new Error('save_error')
    jest.spyOn(userProfileRepo, 'savePicture').mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({
      userId: 'any_id',
      file
    })

    await expect(promise).rejects.toThrow(error)
  })
})
