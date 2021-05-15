import { Controller } from './../../presentation/interfaces/controller'
import { HttpRequest, HttpResponse } from './../../presentation/interfaces/Http'
import { LogControllerDecorator } from './log'
describe('LogControllerDecorator', () => {
  interface sutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
  }
  const makeSutLogControllerDecorator = (): sutTypes => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          body: httpRequest.body,
          statusCode: 200
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    const controllerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    return { sut , controllerStub }
  }
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSutLogControllerDecorator()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }

    }
    await sut.handle(httpRequest)
    expect(handleSpy).toBeCalledWith(httpRequest)
  })
  test('should return the smae result of the controller', async () => {
    const { sut } = makeSutLogControllerDecorator()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }

    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      body: httpRequest.body,
      statusCode: 200
    })
  })
})
