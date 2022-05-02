import jwt from 'jsonwebtoken'
import { JwtTokenHandler } from '@/infra/crypto'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>

    secret = 'any_secret'
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken', () => {
    let key: string
    let expirationInMinutes: number
    let token: string

    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMinutes = 1

      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call sign with correct params', async () => {
      await sut.generateToken({
        key,
        expirationInMinutes
      })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 60 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return a token', async () => {
      const generatedToken = await sut.generateToken({
        key,
        expirationInMinutes
      })

      expect(generatedToken).toBe(token)
    })

    it('should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error('token_error')
      })

      const promise = sut.generateToken({
        key,
        expirationInMinutes
      })

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })

  describe('validateToken', () => {
    let token: string
    let key: string

    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'

      fakeJwt.verify.mockImplementation(() => ({ key }))
    })

    it('should call sign with correct params', async () => {
      await sut.validateToken({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    it('should return the key used to sign', async () => {
      const generatedKey = await sut.validateToken({ token }) // Key is the user id

      expect(generatedKey).toBe(key)
    })
  })
})
