import { RequestHandler } from 'express'
import { BaseController } from '@/application/controllers'

type Adapter = (controller: BaseController) => RequestHandler

export const adaptExpressRoute: Adapter = (controller) => async (req, res) => {
  const successStatusCodes = [200, 204]

  const { statusCode, data } = await controller.handle({ ...req.body, ...req.locals })
  const responseError = !successStatusCodes.includes(statusCode)
  const jsonResponse = responseError ? { error: data.message } : data

  res.status(statusCode).json(jsonResponse)
}
