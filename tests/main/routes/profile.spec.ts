import request from 'supertest'
import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { makeFakePostgresDb } from '@/tests/infra/postgres/mocks'
import { app } from '@/main/config/app'

describe('Profile Routes', () => {
  describe('DELETE /profile/picture', () => {
    let dbBackup: IBackup

    beforeAll(async () => {
      const db = await makeFakePostgresDb([PgUser])
      dbBackup = db.backup() // Salvando backup do banco vazio para limpar entre os testes
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
  })
})
