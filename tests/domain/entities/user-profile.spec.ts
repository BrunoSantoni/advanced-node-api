import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile
  let id: string
  let pictureUrl: string
  let name: string

  beforeAll(() => {
    id = 'any_id'
    pictureUrl = 'any_url'
    name = 'any_name'
  })

  beforeEach(() => {
    sut = new UserProfile(id)
  })

  it('should create with empty initials when pictureUrl is provided with name', () => {
    sut.setPicture({ pictureUrl, name })

    expect(sut).toEqual({
      id,
      pictureUrl,
      initials: undefined
    })
  })

  it('should create with empty initials when pictureUrl is provided without name', () => {
    sut.setPicture({ pictureUrl })

    expect(sut).toEqual({
      id,
      pictureUrl,
      initials: undefined
    })
  })

  it('should create initiails with first letter of first and last names', () => {
    sut.setPicture({ name: 'john second doe' })

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: 'JD'
    })
  })

  it('should create initiails with first two letters of first name if user doesnt have a surname', () => {
    sut.setPicture({ name: 'doe' })

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: 'DO'
    })
  })

  it('should create initiails with first letter if user name is only one character', () => {
    sut.setPicture({ name: 'b' })

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: 'B'
    })
  })

  it('should create with empty initiails when name and pictureUrl are not provided', () => {
    sut.setPicture({})

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: undefined
    })
  })

  it('should create with empty initiails when name and pictureUrl are not provided', () => {
    sut.setPicture({ name: '' })

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
