import { Request, Response, NextFunction, RequestHandler } from 'express'
import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    await middleware.handle({
      ...req.headers
    })
  }
}

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

describe('ExpressMiddleware', () => {
  let middleware: Middleware
  let req: Request
  let res: Response
  let next: NextFunction
  let sut: RequestHandler

  beforeAll(() => {
    middleware = {
      handle: jest.fn(async () => Promise.resolve({ statusCode: 200, data: { any: 'response' } }))
    }
    req = getMockReq({
      headers: {
        any: 'any'
      }
    })
    res = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = adaptExpressMiddleware(middleware)
  })

  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    req = getMockReq()

    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})
