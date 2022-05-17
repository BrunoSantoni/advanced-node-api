import { PgUserProfileRepository } from '@/infra/postgres/repos'

export const makePgUserProfileRepo = (): PgUserProfileRepository => {
  // Infra
  return new PgUserProfileRepository()
}
