import { Validation } from '../presentation/helpers/validators/validation'

export class ValidationComposite implements Validation {
  validate (input: any): Error {
    return null
  }
}
