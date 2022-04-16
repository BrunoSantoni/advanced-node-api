import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { makeFakePostgresDb } from '@/tests/infra/postgres/mocks'

describe('PgUserAccountRepository', () => {
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

  describe('load', () => {
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

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        name: 'any_name',
        email: 'any_email@mail.com',
        facebookId: 'any_fb_id'
      })

      const pgUser = await pgUserRepo.findOne({ where: { email: 'any_email@mail.com' } })

      expect(pgUser?.id).toBe(Number(id))
    })

    it('should update account if id is defined', async () => {
      await pgUserRepo.save({
        name: 'any_name',
        email: 'old_email@mail.com',
        facebookId: 'any_fb_id'
      })

      const { id } = await sut.saveWithFacebook({
        id: '1',
        name: 'new_name',
        email: 'new_email@mail.com',
        facebookId: 'new_fb_id'
      })

      const pgUser = await pgUserRepo.findOneBy({ id: 1 })

      expect(pgUser).toEqual({
        id: 1,
        name: 'new_name',
        email: 'old_email@mail.com',
        facebookId: 'new_fb_id'
      })
      expect(id).toBe('1')
    })
  })
})
