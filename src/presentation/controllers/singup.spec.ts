import SignUpController from './SignUpController'
import { EmailValidator } from '../interfaces/'
import { MissingParamError, InvalidParamError, ServerError } from '../errors/'
import { CreateAccount, CreateAccountModel } from '../../domain/usecases/create-account'
import { AccountModel } from '../../domain/models/account'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    create (account: CreateAccountModel): AccountModel {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_passord'
      }
    }
  }
  return new CreateAccountStub()
}
interface sutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  createAccountStub: CreateAccount
}
const makeSut = (): sutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const createAccountStub = makeCreateAccount()
  const sut = new SignUpController(emailValidatorStub,createAccountStub)
  return {
    sut,
    emailValidatorStub,
    createAccountStub
  }
}
describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passowrdConfirmation: 'any_password'
      }
    }
    const httRes = sut.handle(httpRequest)
    expect(httRes.statusCode).toBe(400)
    expect(httRes.body).toEqual(new MissingParamError('name'))
  })
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httRes = sut.handle(httpRequest)
    expect(httRes.statusCode).toBe(400)
    expect(httRes.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httRes = sut.handle(httpRequest)
    expect(httRes.statusCode).toBe(400)
    expect(httRes.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httRes = sut.handle(httpRequest)
    expect(httRes.statusCode).toBe(400)
    expect(httRes.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if  password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'another_password'

      }
    }
    const httRes = sut.handle(httpRequest)
    expect(httRes.statusCode).toBe(400)
    expect(httRes.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httRes = sut.handle(httpRequest)
    expect(httRes.statusCode).toBe(400)
    expect(httRes.body).toEqual(new InvalidParamError('email'))
  })
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('any_email@mail.com')
  })
  test('Should call creatorAccount with correct values', () => {
    const { sut,createAccountStub } = makeSut()
    const createSpy = jest.spyOn(createAccountStub, 'create')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(createSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
  test('Should return 500 if EmailValidator throws ', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httRes = sut.handle(httpRequest)
    expect(httRes.statusCode).toBe(500)
    expect(httRes.body).toEqual(new ServerError())
  })
})
