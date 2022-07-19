import { ValidationError } from './errors.js';

export const validateNotEmpty = (text: string, errorMessage: string) => {
  if (!text || text.trim().length === 0) {
    throw new ValidationError(errorMessage);
  }
};
