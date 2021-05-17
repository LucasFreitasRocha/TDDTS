import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../interfaces'

export default class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    // const { email, password } = httpRequest.body
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return null
  }
}
