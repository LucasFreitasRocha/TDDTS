import { serverError, unauthorized, badRequest, ok } from './../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import LoginController from './LoginController'
import { Authentication, EmailValidator, HttpRequest } from './login-interfaces'

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
  const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
      async auth (email: string, passowrd: string): Promise<string> {
        return new Promise(resolve => resolve('any_token'))
      }
    }
    return new AuthenticationStub()
  }
  interface sutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication

  }
  const makeSut = (): sutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(emailValidatorStub, authenticationStub)

    return {
      sut,
      emailValidatorStub,
      authenticationStub
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
  test('Should call Authetication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toBeCalledWith('any_email@mail.com', 'any_password')
  })
  test('Should return 401 if bad credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = makeFakeRequest()
    const httpRes = await sut.handle(httpRequest)
    expect(httpRes).toEqual(unauthorized())
  })
  test('Should return 500 if Authetication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve,reject) => reject(new Error()))
    )
    const httpRequest = makeFakeRequest()
    const httpRes = await sut.handle(httpRequest)
    expect(httpRes).toEqual(serverError(new Error('')))
  })
  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpRes = await sut.handle(httpRequest)
    expect(httpRes).toEqual(ok({
      accessToken: 'any_token'
    }))
  })
})
