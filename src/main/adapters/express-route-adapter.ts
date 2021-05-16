import { HttpRequest, HttpResponse } from './../../presentation/interfaces/Http'
import { Controller } from './../../presentation/interfaces/controller'
import { Request, Response } from 'express'
export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json(
        { error: httpResponse.body.message }
      )
    }
  }
}
