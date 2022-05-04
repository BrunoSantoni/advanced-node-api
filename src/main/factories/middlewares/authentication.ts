import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJwtTokenHandler } from '@/main/factories/crypto'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  // Infra
  const crypto = makeJwtTokenHandler()

  // Presentation

  // Se passar o crypto.validateToken sem o bind, ele vai ter a referência da função, mas não vai
  // ter a referência das variáveis da classe, fazendo o código quebrar (Aula 58 4m)
  return new AuthenticationMiddleware(crypto.validateToken.bind(crypto))
}
