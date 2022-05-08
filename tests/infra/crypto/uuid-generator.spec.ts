import { v4 } from 'uuid'
import { UUIDGenerator } from '@/infra/crypto'

jest.mock('uuid')

describe('UUIDGenerator', () => {
  it('should call uuid v4', () => {
    const sut = new UUIDGenerator()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
})
