import { IDGenerator } from '@/domain/contracts/gateways'

export class UniqueIdGenerator implements IDGenerator {
  constructor (
    private readonly date: Date
  ) {}

  uuid ({ key }: IDGenerator.Input): IDGenerator.Output {
    return key +
    '_' +
    String(this.date.getFullYear()) +
    String(this.date.getMonth() + 1).padStart(2, '0') +
    String(this.date.getDate()).padStart(2, '0') +
    String(this.date.getHours()).padStart(2, '0') +
    String(this.date.getMinutes()).padStart(2, '0') +
    String(this.date.getSeconds()).padStart(2, '0')
  }
}
