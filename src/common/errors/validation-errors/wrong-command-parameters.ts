import { PreconditionFailedException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export class WrongCommandParametersError extends PreconditionFailedException {
  application_error_code: string = 'WRONG_COMMAND_PARAMETERS';
  details?: any;

  constructor(errors: ValidationError[] = []) {
    const errorMessage = errors.map((error) => error.toString()).join(', ');
    super(errorMessage);
  }
}
