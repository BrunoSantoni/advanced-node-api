import { v4 } from 'uuid'
import { IDGenerator } from '@/domain/contracts/gateways'

export class UUIDGenerator implements IDGenerator {
  uuid ({ key }: IDGenerator.Input): IDGenerator.Output {
    const uuid = v4()

    return `${key}_${uuid}`
  }
}
