import { HttpRequest, HttpResponse, Controller, EmailValidator, CreateAccount } from './sign-interfaces'
import { MissingParamError, InvalidParamError } from '../../errors/'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly createAccount: CreateAccount
  constructor (emailValidator: EmailValidator, createAccount: CreateAccount) {
    this.emailValidator = emailValidator
    this.createAccount = createAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const { name, email, password, passwordConfirmation } = httpRequest.body
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = this.createAccount.create({
        name, email, password
      })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
