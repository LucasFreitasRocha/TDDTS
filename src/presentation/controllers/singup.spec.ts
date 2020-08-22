import SignUpController from './SignUpController'
import { MissingParamError } from '../errors/missing-param.error'

describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        passowrd: 'any_password',
        passowrdConfirmation: 'any_password'
      }
    }
    const httRes = sut.handle(httpRequest)
    expect(httRes.statusCode).toBe(400)
    expect(httRes.body).toEqual(new MissingParamError('name'))
  })
  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        passowrd: 'any_password',
        passowrdConfirmation: 'any_password'
      }
    }
    const httRes = sut.handle(httpRequest)
    expect(httRes.statusCode).toBe(400)
    expect(httRes.body).toEqual(new MissingParamError('email'))
  })
})
