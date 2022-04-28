import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationService } from '@/main/factories/services'

export const makeFacebookLoginController = (): FacebookLoginController => {
  // Data
  const fbAuthenticationService = makeFacebookAuthenticationService()

  // Presentation
  return new FacebookLoginController(fbAuthenticationService)
}
