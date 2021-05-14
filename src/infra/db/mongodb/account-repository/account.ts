import { CreateAccountRepository } from '../../../../data/interfaces/create-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { CreateAccountModel } from '../../../../domain/usecases/create-account'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements CreateAccountRepository {
  async create (account: CreateAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await (await accountCollection).insertOne(account)
    const { _id, ...accountWithoutId } = result.ops[0]
    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
