import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases'
import { makeFacebookApi, makeJwtTokenHandler } from '@/main/factories/gateways'
import { makePgUserAccountRepo } from '@/main/factories/repos'

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
