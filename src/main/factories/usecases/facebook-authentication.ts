import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepo } from '@/main/factories/repos'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  // Infra
  const jwtTokenGenerator = makeJwtTokenGenerator()
  const pgUserAccountRepo = makePgUserAccountRepo()

  const fbApi = makeFacebookApi()

  // Data
  return setupFacebookAuthentication(
    jwtTokenGenerator,
    fbApi,
    pgUserAccountRepo
  )
}
