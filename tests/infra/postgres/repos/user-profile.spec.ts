import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { PgUserProfileRepository } from '@/infra/postgres/repos'
import { makeFakePostgresDb } from '@/tests/infra/postgres/mocks'

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository
  let pgUserRepo: Repository<PgUser>
  let dbBackup: IBackup

  beforeAll(async () => {
    const db = await makeFakePostgresDb([PgUser])
    dbBackup = db.backup() // Salvando backup do banco vazio para limpar entre os testes

    pgUserRepo = getRepository(PgUser)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    dbBackup.restore() // Restaurando o backup gerado do banco vazio
    sut = new PgUserProfileRepository()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('savePicture()', () => {
    it('should update user profile', async () => {
      const { id } = await pgUserRepo.save({
        email: 'any@mail.com',
        initials: 'AI'
      })

      await sut.savePicture({
        id: String(id),
        pictureUrl: 'any_url',
        initials: undefined
      })

      const pgUser = await pgUserRepo.findOne({ where: { id } })

      expect(pgUser).toMatchObject({
        id,
        pictureUrl: 'any_url',
        initials: null // O initials vai ser null pq não existe undefined no banco
      })
    })

    it('should update user profile without picture', async () => {
      const { id } = await pgUserRepo.save({
        email: 'any@mail.com',
        initials: 'AI',
        pictureUrl: 'any_url'
      })

      await sut.savePicture({
        id: String(id),
        initials: 'JD'
      })

      const pgUser = await pgUserRepo.findOne({ where: { id } })

      expect(pgUser).toMatchObject({
        id,
        pictureUrl: null,
        initials: 'JD'
      })
    })
  })
})
