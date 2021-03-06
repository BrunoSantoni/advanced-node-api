import { NextFunction, Request, RequestHandler, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { BaseController } from '@/application/controllers'
import { adaptExpressRoute } from '@/main/adapters'

class ControllerSpy extends BaseController {
  result = {
    statusCode: 200,
    data: {
      any: 'response'
    }
  }

  async perform (httpRequest: any): Promise<any> {
    return this.result
  }
}

describe('ExpressRouter', () => {
  let sut: RequestHandler
  let controller: BaseController

  let req: Request
  let res: Response
  let next: NextFunction

  beforeAll(() => {
    req = getMockReq({
      body: {
        anyBody: 'any_body'
      },
      locals: {
        anyLocals: 'any_locals'
      }
    })
    res = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    jest.clearAllMocks()

    controller = new ControllerSpy()
    sut = adaptExpressRoute(controller)
  })

  it('should call handle with correct request', async () => {
    const handleSpy = jest.spyOn(controller, 'handle')

    await sut(req, res, next)

    // Por enquanto só se preocupa com o body
    expect(handleSpy).toHaveBeenCalledWith({
      anyBody: 'any_body',
      anyLocals: 'any_locals'
    })
    expect(handleSpy).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const req = getMockReq()
    const handleSpy = jest.spyOn(controller, 'handle')

    await sut(req, res, next)

    // Por enquanto só se preocupa com o body
    expect(handleSpy).toHaveBeenCalledWith({})
    expect(handleSpy).toHaveBeenCalledTimes(1)
  })

  it('should return with 200 and valid data', async () => {
    await sut(req, res, next)

    // Por enquanto só se preocupa com o body
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      any: 'response'
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should return with 204 and valid empty data', async () => {
    jest.spyOn(controller, 'handle').mockResolvedValueOnce({
      statusCode: 204,
      data: null
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(null)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should return with 400 and valid error', async () => {
    jest.spyOn(controller, 'handle').mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error')
    })
    await sut(req, res, next)

    // Por enquanto só se preocupa com o body
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      error: 'any_error'
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should return with 500 and valid error', async () => {
    jest.spyOn(controller, 'handle').mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    })
    await sut(req, res, next)

    // Por enquanto só se preocupa com o body
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      error: 'any_error'
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
