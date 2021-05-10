import { AccountModel } from '../../domain/models/account'
import { CreateAccountModel } from '../../domain/usecases/create-account'

export interface CreateAccountRepository {
  create (account: CreateAccountModel): Promise<AccountModel>
}
