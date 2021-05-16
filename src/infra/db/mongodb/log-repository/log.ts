import { LogErrorRepository } from './../../../../data/interfaces/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'
export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('log-errors')
    errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
