import { FacebookAccount } from '@/domain/models'

const makeFakeFbData = (): { name: string, email: string, facebookId: string } => ({
  name: 'any_fb_name',
  email: 'any_fb_email@mail.com',
  facebookId: 'any_fb_id'
})

const makeFakeAccountData = (): { id?: string, name?: string } => ({
  id: 'any_id',
  name: 'any_name'
})

describe('FacebookAccountModel', () => {
  it('Should create with facebook data only', () => {
    // Arrange
    const fakeFbData = makeFakeFbData()

    // Act
    const sut = new FacebookAccount(fakeFbData)

    // Assert
    expect(sut).toEqual(fakeFbData)
  })

  it('Should not update account name using fb name if already exists', () => {
    // Arrange
    const fakeFbData = makeFakeFbData()
    const fakeAccountData = makeFakeAccountData()

    // Act
    const sut = new FacebookAccount(fakeFbData, fakeAccountData)

    // Assert
    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email@mail.com',
      facebookId: 'any_fb_id'
    })
  })

  it('Should update account name using fb name if its empty', () => {
    // Arrange
    const fbData = makeFakeFbData()
    const accountData = { id: 'any_id' }

    // Act
    const sut = new FacebookAccount(fbData, accountData)

    // Assert
    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email@mail.com',
      facebookId: 'any_fb_id'
    })
  })
})
