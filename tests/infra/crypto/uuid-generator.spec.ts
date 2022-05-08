import { v4 } from 'uuid'
import { UUIDGenerator } from '@/infra/crypto'

jest.mock('uuid')

describe('UUIDGenerator', () => {
  let sut: UUIDGenerator

  beforeAll(() => {
    jest.mocked(v4).mockReturnValue('any_uuid')
  })

  beforeEach(() => {
    sut = new UUIDGenerator()
  })

  it('should call uuid.v4()', () => {
    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('should return correct uuid', () => {
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})
