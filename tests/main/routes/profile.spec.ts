import request from 'supertest'
import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import { PgUser } from '@/infra/postgres/entities'
import { makeFakePostgresDb } from '@/tests/infra/postgres/mocks'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'

describe('Profile Routes', () => {
  describe('DELETE /profile/picture', () => {
    let dbBackup: IBackup
    let pgUserRepo: Repository<PgUser>

    beforeAll(async () => {
      const db = await makeFakePostgresDb([PgUser])
      dbBackup = db.backup() // Salvando backup do banco vazio para limpar entre os testes

      pgUserRepo = getRepository(PgUser)
    })

    beforeEach(async () => {
      dbBackup.restore() // Restaurando o backup gerado do banco vazio
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return 403 if no authorization header is provided', async () => {
      const { status } = await request(app)
        .delete('/api/profile/picture')
        .send()

      expect(status).toBe(403)
    })

    it('should return 204 on success', async () => {
      const { id: userId } = await pgUserRepo.save({ email: 'any@mail.com' })

      const authorization = sign({ key: userId }, env.jwtSecret)

      const { status, body } = await request(app)
        .delete('/api/profile/picture')
        .set({
          authorization
        })
        .send()

      expect(status).toBe(204)
      expect(body).toEqual({})
    })
  })
})
