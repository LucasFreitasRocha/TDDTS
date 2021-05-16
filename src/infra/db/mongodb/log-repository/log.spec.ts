import { MongoHelper } from '../helpers/mongo-helper'

describe('Log Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const errorCollection = MongoHelper.getCollection('log-errors')
    await (await errorCollection).deleteMany({})
  })
  test('Should ', () => {
    expect(1).toBe(1)
  })
})
