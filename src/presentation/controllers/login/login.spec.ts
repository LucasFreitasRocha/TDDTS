import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import LoginController from './LoginController'

describe('', () => {
  const makeSut = (): LoginController => {
    return new LoginController()
  }
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httRes = await sut.handle(httpRequest)
    expect(httRes).toEqual(badRequest(new MissingParamError('email')))
  })
})
