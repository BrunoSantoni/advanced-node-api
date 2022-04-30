import { Router } from 'express'
import { makeFacebookLoginController } from '@/main/factories/controllers'
import { adaptExpressRoute } from '@/infra/http'

export const route = (router: Router): void => {
  const controller = makeFacebookLoginController()

  router.post('/login/facebook', adaptExpressRoute(controller))
}
