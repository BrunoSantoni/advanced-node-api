import { Request, Response } from 'express'
import { BaseController } from '@/application/controllers'

export class ExpressRouter {
  constructor (
    private readonly controller: BaseController
  ) {}

  async adapt (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body })

    if (httpResponse.statusCode !== 200) {
      res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.data)
    }
  }
}
