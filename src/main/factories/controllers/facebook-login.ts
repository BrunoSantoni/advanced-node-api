import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthentication } from '@/main/factories/usecases'

export const makeFacebookLoginController = (): FacebookLoginController => {
  // Data
  const fbAuthenticationService = makeFacebookAuthentication()

  // Presentation
  return new FacebookLoginController(fbAuthenticationService)
}
