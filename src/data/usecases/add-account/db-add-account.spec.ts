
import {
  AccountModel,
  CreateAccountModel,
  Encrypter,
  CreateAccountRepository
} from './db-add-account-interfaces'
import { DbAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create (account: CreateAccountModel): Promise<AccountModel> {
      return new Promise((resolve) =>
        resolve({
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'hashed_password'
        })
      )
    }
  }
  return new CreateAccountRepositoryStub()
}
interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  createAccountRepositoryStub: CreateAccountRepository

}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const createAccountRepositoryStub = makeCreateAccountRepository()
  const sut = new DbAddAccount(encrypterStub, createAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    createAccountRepositoryStub
  }
}
describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.create({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.create({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
    await expect(promise).rejects.toThrow()
  })
  test('Should call CreateAccountRepository with correct data ', async () => {
    const { createAccountRepositoryStub, sut } = makeSut()
    const createSpy = jest.spyOn(createAccountRepositoryStub, 'create')
    const fakeAccount = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.create(fakeAccount)
    expect(createSpy).toHaveBeenCalledWith(Object.assign({}, fakeAccount , { password: 'hashed_password' }))
  })
  test('Should throw if CreateAccountRepository throws', async () => {
    const { createAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(createAccountRepositoryStub, 'create')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.create({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const fakeAccount = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const account = await sut.create(fakeAccount)
    expect(account).toEqual(Object.assign({}, fakeAccount , { password: 'hashed_password', id: 'valid_id' }))
  })
})
