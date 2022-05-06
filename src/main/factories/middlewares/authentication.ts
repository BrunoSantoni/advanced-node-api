import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJwtTokenHandler } from '@/main/factories/gateways'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  // Infra
  const tokenHandler = makeJwtTokenHandler()

  // Presentation

  // Se passar o tokenHandler.validate sem o bind, ele vai ter a referência da função, mas não vai
  // ter a referência das variáveis da classe, fazendo o código quebrar (Aula 58 4m)
  return new AuthenticationMiddleware(tokenHandler.validate.bind(tokenHandler))
}
