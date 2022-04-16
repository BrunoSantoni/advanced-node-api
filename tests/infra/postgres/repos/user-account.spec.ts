import { IBackup, newDb } from 'pg-mem'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { Column, Entity, getRepository, Repository, PrimaryGeneratedColumn, getConnection } from 'typeorm'

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)

    const pgUser = await pgUserRepo.findOne({
      where: {
        email: params.email
      }
    })

    if (pgUser === null) {
      return undefined
    }

    const userInfo = {
      id: pgUser.id.toString(),
      name: pgUser.name
    }

    if (pgUser.name === null) {
      delete userInfo.name
    }

    return userInfo
  }
}

@Entity({ name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'nome', nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let dbBackup: IBackup

    beforeAll(async () => {
      const db = newDb()
      db.public.registerFunction({
        implementation: () => 'test',
        name: 'current_database'
      })

      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize()
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
