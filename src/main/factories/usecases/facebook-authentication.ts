import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepo } from '@/main/factories/repos'
import { makeJwtTokenHandler } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  // Infra
  const jwtTokenHandler = makeJwtTokenHandler()
  const pgUserAccountRepo = makePgUserAccountRepo()

  const fbApi = makeFacebookApi()

  // Data
  return setupFacebookAuthentication(
    jwtTokenHandler,
    fbApi,
    pgUserAccountRepo
  )
}
