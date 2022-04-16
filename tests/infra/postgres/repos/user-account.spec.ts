import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'

const makeFakePostgresDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database'
  })

  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.synchronize()

  return db
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let dbBackup: IBackup

    beforeAll(async () => {
      const db = await makeFakePostgresDb([PgUser])
      dbBackup = db.backup() // Salvando backup do banco vazio para limpar entre os testes

      pgUserRepo = getRepository(PgUser)
    })

    beforeEach(async () => {
      dbBackup.restore() // Restaurando o backup gerado do banco vazio
      sut = new PgUserAccountRepository()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return an account if email exists', async () => {
      await pgUserRepo.save({
        email: 'existing_email@mail.com'
      })

      const account = await sut.load({
        email: 'existing_email@mail.com'
      })

      expect(account).toEqual({
        id: '1'
      })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({
        email: 'new_email@mail.com'
      })

      expect(account).toEqual(undefined)
    })
  })
})
