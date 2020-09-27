import { CreateAccount, CreateAccountModel , AccountModel, Encrypter } from './db-add-account-interfaces'
export class DbAddAccount implements CreateAccount {
  private readonly encrypter: Encrypter
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async create (account: CreateAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
