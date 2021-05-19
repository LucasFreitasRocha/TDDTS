import { Validation } from '../../presentation/helpers/validators/validation'
import { RequiredFieldValidation } from '../../validation/required-field-validation'
import { ValidationComposite } from '../../validation/validation'
import { makeSignUpValidation } from './signup-validation-factory'
jest.mock('../../validation/validation')
describe('SignUpValidation Factory', () => {
  test('Should call validationComposite with all validatations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
