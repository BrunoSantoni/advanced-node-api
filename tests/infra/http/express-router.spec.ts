import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { BaseController } from '@/application/controllers'

class ControllerSpy extends BaseController {
  result = {
    statusCode: 200,
    data: 'any_data'
  }

  async perform (httpRequest: any): Promise<any> {
    return this.result
  }
}

class ExpressRouter {
  constructor (
    private readonly controller: BaseController
  ) {}

  async adapt (req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body })
  }
}

describe('ExpressRouter', () => {
  let sut: ExpressRouter
  let controller: BaseController

  let req: Request
  let res: Response

  beforeEach(() => {
    req = getMockReq({
      body: {
        any: 'value'
      }
    })

    res = getMockRes().res

    controller = new ControllerSpy()
    sut = new ExpressRouter(controller)
  })

  it('should call handle with correct request', async () => {
    const handleSpy = jest.spyOn(controller, 'handle')

    await sut.adapt(req, res)

    // Por enquanto só se preocupa com o body
    expect(handleSpy).toHaveBeenCalledWith({
      any: 'value'
    })
  })

  it('should call handle with empty request', async () => {
    const req = getMockReq()
    const handleSpy = jest.spyOn(controller, 'handle')

    await sut.adapt(req, res)

    // Por enquanto só se preocupa com o body
    expect(handleSpy).toHaveBeenCalledWith({})
  })
})
