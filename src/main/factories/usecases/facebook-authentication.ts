import { FacebookAuthenticationUseCase } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepo } from '@/main/factories/repos'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
  // Infra
  const jwtTokenGenerator = makeJwtTokenGenerator()
  const pgUserAccountRepo = makePgUserAccountRepo()

  const fbApi = makeFacebookApi()

  // Data
  return new FacebookAuthenticationUseCase(
    jwtTokenGenerator,
    fbApi,
    pgUserAccountRepo
  )
}
