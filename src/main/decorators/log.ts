
import { LogErrorRepository } from '../../data/interfaces/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/interfaces'

export class LogControllerDecorator implements Controller {
  private readonly controler: Controller
  private readonly logErrorRepository: LogErrorRepository
  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controler = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controler.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack)
    }
    return httpResponse
  }
}
