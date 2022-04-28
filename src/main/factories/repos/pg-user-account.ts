import { PgUserAccountRepository } from '@/infra/postgres/repos'

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
  // Infra
  return new PgUserAccountRepository()
}
