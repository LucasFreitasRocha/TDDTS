import { badRequest, ok, serverError } from './../../helpers/http-helper'
import { HttpRequest } from './../../interfaces/Http'
import SignUpController from './SignUpController'
import { EmailValidator, CreateAccount, CreateAccountModel, AccountModel, Validation } from './sign-interfaces'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
)
const makeCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async create (account: CreateAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new CreateAccountStub()
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})
interface sutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  createAccountStub: CreateAccount
  validationStub: Validation
}
const makeSut = (): sutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const createAccountStub = makeCreateAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub,createAccountStub, validationStub)
  return {
    sut,
    emailValidatorStub,
    createAccountStub,
    validationStub
  }
}
describe('SingUp Controller', () => {
  test('Should return 400 if  password confirmation fails',async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'another_password'

      }
    }
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })
  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should call EmailValidator with correct email',async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('any_email@mail.com')
  })
  test('Should call creatorAccount with correct values', async () => {
    const { sut,createAccountStub } = makeSut()
    const createSpy = jest.spyOn(createAccountStub, 'create')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(createSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
  test('Should return 500 if EmailValidator throws ',async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(serverError(new ServerError(null)))
  })
  test('Should return 500 if CreateAccount throws ', async () => {
    const { sut, createAccountStub } = makeSut()
    jest.spyOn(createAccountStub,'create').mockImplementationOnce(async () => {
      return new Promise((resolve,reject) => reject(new Error()))
    })
    const httpRequest = makeFakeRequest()
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(serverError(new ServerError(null)))
  })
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation with correct values', async () => {
    const { sut,validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_filed'))
    const httpRequest = makeFakeRequest()
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(badRequest(new MissingParamError('any_filed')))
  })
})
