import request from 'supertest'
import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import { UnauthorizedError } from '@/application/errors'
import { PgUser } from '@/infra/postgres/entities'
import { makeFakePostgresDb } from '@/tests/infra/postgres/mocks'
import { app } from '@/main/config/app'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let dbBackup: IBackup
    const loadUserSpy = jest.fn() // Criando o spy fora para poder mockar valores diferentes para os testes
    jest.mock('@/infra/apis/facebook', () => ({
      // MOCKANDO O CONSTRUTOR, MUITO ÚTIL, O CONSTRUTOR RETORNA UM OBJETO COM A FUNÇÃO
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

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

    it('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({
        facebookId: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com'
      })

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body).toEqual({
        error: new UnauthorizedError().message
      })
    })
  })
})
