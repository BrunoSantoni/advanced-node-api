import { RequestHandler } from 'express'
import { BaseController } from '@/application/controllers'

export const adaptExpressRoute = (controller: BaseController): RequestHandler => {
  return async (req, res) => {
    const { statusCode, data } = await controller.handle({ ...req.body })
    const responseError = statusCode !== 200
    const jsonResponse = responseError ? { error: data.message } : data

    res.status(statusCode).json(jsonResponse)
  }
}
