import { Router } from 'express'
import { makeDeleteProfilePictureController } from '@/main/factories/controllers'
import { adaptExpressRoute } from '@/main/adapters'
import { auth } from '@/main/middlewares'

export const route = (router: Router): void => {
  const controller = makeDeleteProfilePictureController()

  router.delete('/profile/picture', auth, adaptExpressRoute(controller))
}
