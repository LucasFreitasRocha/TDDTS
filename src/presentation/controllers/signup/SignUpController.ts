import { Validation } from './../../helpers/validators/validation'
import { HttpRequest, HttpResponse, Controller, EmailValidator, CreateAccount } from './sign-interfaces'
import { MissingParamError, InvalidParamError } from '../../errors/'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly createAccount: CreateAccount
  private readonly validation: Validation
  constructor (emailValidator: EmailValidator, createAccount: CreateAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.createAccount = createAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password, passwordConfirmation } = httpRequest.body
    try {
      this.validation.validate(httpRequest.body)
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
      const account = await this.createAccount.create({
        name, email, password
      })

      return ok(account)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
