import { serverError } from './../../helpers/http-helper'
import { EmailValidator } from './../../interfaces/email-validator'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import LoginController from './LoginController'
import { HttpRequest } from '../../interfaces'

describe('', () => {
  const makeFakeRequest = (): HttpRequest => ({
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  })
  const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }
    return new EmailValidatorStub()
  }
  interface sutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator

  }
  const makeSut = (): sutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(emailValidatorStub)
    return {
      sut,
      emailValidatorStub

    }
  }
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com'
      }
    }
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(badRequest(new MissingParamError('password')))
  })
  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('any_email@mail.com')
  })
  test('Should return 500 if emailValidotor throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('')
    })
    const httpRequest = makeFakeRequest()
    const httpRes = await sut.handle(httpRequest)
    expect(httpRes).toEqual(serverError(new Error('')))
  })
})
