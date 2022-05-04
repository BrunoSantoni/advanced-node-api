import { RequestHandler } from 'express'
import { Middleware } from '@/application/middlewares'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({
      ...req.headers
    })

    if (statusCode === 200) {
      // Object.Entries retorna um array com a key e o value do objeto
      // entry[0] = ['prop', undefined]
      const entries = Object.entries(data).filter(entry => entry[1])

      req.locals = { ...req.locals, ...Object.fromEntries(entries) }
      next()
    } else {
      res.status(statusCode).json(data)
    }
  }
}
