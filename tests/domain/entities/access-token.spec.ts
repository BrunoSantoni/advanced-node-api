import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  it('should expire in 30 minutes', () => {
    expect(AccessToken.expirationInMinutes).toBe(30)
  })
})
