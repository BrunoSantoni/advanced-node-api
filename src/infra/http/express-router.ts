import { RequestHandler } from 'express'
import { BaseController } from '@/application/controllers'

export const adaptExpressRoute = (controller: BaseController): RequestHandler => {
  return async (req, res) => {
    const httpResponse = await controller.handle({ ...req.body })

    if (httpResponse.statusCode !== 200) {
      res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.data)
    }
  }
}
