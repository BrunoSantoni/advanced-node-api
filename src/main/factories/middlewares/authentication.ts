import { AuthenticationMiddleware } from '@/application/middlewares'
import { setupAuthorize } from '@/domain/usecases'
import { makeJwtTokenHandler } from '@/main/factories/crypto'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  // Infra
  const crypto = makeJwtTokenHandler()

  // Data
  const authorizeService = setupAuthorize(crypto)

  // Presentation
  return new AuthenticationMiddleware(authorizeService)
}
