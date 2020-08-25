import { HttpRequest, HttpResponse } from '../interfaces/Http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../interfaces/controller'
import { EmailValidator } from '../interfaces/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
