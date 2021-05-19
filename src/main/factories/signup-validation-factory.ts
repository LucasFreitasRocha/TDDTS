import { Validation } from '../../presentation/helpers/validators/validation'
import { RequiredFieldValidation } from '../../validation/required-field-validation'
import { ValidationComposite } from '../../validation/validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
