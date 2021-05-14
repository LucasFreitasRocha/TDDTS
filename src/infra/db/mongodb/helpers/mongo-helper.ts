import { Collection, MongoClient } from 'mongodb'
export const MongoHelper = {
  client: null as MongoClient,
  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url , {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  async getCollection (name: string): Promise<Collection<any>> {
    return this.client.db().collection(name)
  },
  map: (result: any): any => {
    const { _id, ...resultWithoutId } = result.ops[0]
    return Object.assign({}, resultWithoutId, { id: _id })
  }
}
