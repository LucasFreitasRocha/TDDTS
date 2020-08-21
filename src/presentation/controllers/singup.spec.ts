import SignUpController from './SignUpController'

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
  })
})
