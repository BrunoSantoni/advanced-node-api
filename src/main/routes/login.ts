import { Router } from 'express'

export const route = (router: Router): void => {
  router.post('/api/login/facebook', (req, res) => {
    res.send({ data: 'any_data' })
  })
}
