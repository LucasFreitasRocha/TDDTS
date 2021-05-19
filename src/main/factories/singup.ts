import { LogMongoRepository } from './../../infra/db/mongodb/log-repository/log'

import { Controller } from './../../presentation/interfaces/controller'
import { AccountMongoRepository } from './../../infra/db/mongodb/account-repository/account'
import { BcryptAdapter } from './../../infra/criptography/bcrypt-adapter'
import { DbAddAccount } from './../../data/usecases/add-account/db-add-account'
import { EmailValidatorAdapter } from './../../utils/email-validator-adapter'
import SignUpController from '../../presentation/controllers/signup/SignUpController'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validation = makeSignUpValidation()
  return new LogControllerDecorator(new SignUpController(emailValidator, dbAddAccount, validation), new LogMongoRepository())
}
