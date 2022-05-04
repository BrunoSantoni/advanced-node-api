import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { app } from '@/main/config/app'
import { ForbiddenError } from '@/application/errors'
import { auth } from '@/main/middlewares'
import { env } from '@/main/config/env'

describe('Authentication Middleware', () => {
  it('should return 403 if authorization header is not provided', async () => {
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals)
    })

    const { status, body } = await request(app).get('/fake_route')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })

  it('should return 200 if authorization header is valid', async () => {
    // No teste de integração poderíamos mockar o JWT ou usar o real
    // Foi optado por usar a lib real e gerar um token
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret)
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals)
    })
    const { status, body } = await request(app)
      .get('/fake_route')
      .set({ authorization })

    expect(status).toBe(200)
    expect(body).toEqual({
      userId: 'any_user_id'
    })
  })

  it('should return 403 if authorization header is invalid', async () => {
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals)
    })
    const { status, body } = await request(app)
      .get('/fake_route')
      .set({ authorization: 'invalid_auth' })

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })
})
