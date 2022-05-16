import { Router } from 'express'
import { auth } from '@/main/middlewares'

export const route = (router: Router): void => {
  router.delete('/profile/picture', auth)
}
