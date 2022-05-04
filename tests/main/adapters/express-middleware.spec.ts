import { Request, Response, NextFunction, RequestHandler } from 'express'
import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = (middleware) => {
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
      handle: jest.fn(async () => Promise.resolve({
        statusCode: 200,
        data: {
          emptyProp: '',
          nullProp: null,
          undefinedProp: undefined,
          prop: 'any_value'
        }
      }))
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

  it('should return correct error and statusCode', async () => {
    jest.spyOn(middleware, 'handle').mockResolvedValueOnce({
      statusCode: 500,
      data: { error: 'any_error' }
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should add valid data to req.locals', async () => {
    await sut(req, res, next)

    expect(req.locals).toEqual({ prop: 'any_value' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
