import { IDGenerator } from '@/domain/contracts/gateways'
import { v4 } from 'uuid'

export class UUIDGenerator {
  uuid ({ key }: IDGenerator.Input): void {
    v4()
  }
}
