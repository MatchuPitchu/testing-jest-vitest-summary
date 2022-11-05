import { ValidationError } from './errors.js';

export const validateNotEmpty = (input: FormDataEntryValue, errorMessage: string) => {
  if (typeof input !== 'string') return;

  if (!input || input.trim().length === 0) {
    throw new ValidationError(errorMessage);
  }
};
