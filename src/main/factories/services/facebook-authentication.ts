import { FacebookAuthenticationService } from '@/domain/services'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepo } from '@/main/factories/repos'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  // Infra
  const jwtTokenGenerator = makeJwtTokenGenerator()
  const pgUserAccountRepo = makePgUserAccountRepo()

  const fbApi = makeFacebookApi()

  // Data
  return new FacebookAuthenticationService(
    jwtTokenGenerator,
    fbApi,
    pgUserAccountRepo
  )
}
