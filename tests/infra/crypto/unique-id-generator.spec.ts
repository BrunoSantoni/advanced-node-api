import { UniqueIdGenerator } from '@/infra/crypto'

describe('UniqueIDGenerator', () => {
  it('should return unique id based on key + date', () => {
    const sut = new UniqueIdGenerator(new Date(2022, 6, 7, 10, 30, 0))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20220707103000')
  })

  it('should return unique id based on key + date', () => {
    const sut = new UniqueIdGenerator(new Date(2015, 0, 31, 23, 25, 10))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20150131232510')
  })
})
