import { newDb } from 'pg-mem'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm'

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
    it('should return an account if email exists', async () => {
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

      const pgUserRepo = getRepository(PgUser)
      await pgUserRepo.save({
        email: 'existing_email@mail.com'
      })

      const sut = new PgUserAccountRepository()

      const account = await sut.load({
        email: 'existing_email@mail.com'
      })

      expect(account).toEqual({
        id: '1'
      })
    })
  })
})
