import { RequestHandler } from 'express'
import { BaseController } from '@/application/controllers'

type Adapter = (controller: BaseController) => RequestHandler

export const adaptExpressRoute: Adapter = (controller) => async (req, res) => {
  const { statusCode, data } = await controller.handle({ ...req.body })
  const responseError = statusCode !== 200
  const jsonResponse = responseError ? { error: data.message } : data

  res.status(statusCode).json(jsonResponse)
}
