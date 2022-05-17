import { UUIDGenerator, UniqueIdGenerator } from '@/infra/crypto'

export const makeUUIDGenerator = (): UUIDGenerator => {
  return new UUIDGenerator()
}

export const makeUniqueIdGenerator = (): UniqueIdGenerator => {
  return new UniqueIdGenerator(new Date())
}
