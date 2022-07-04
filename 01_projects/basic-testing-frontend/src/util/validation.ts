export const validateStringNotEmpty = (value: FormDataEntryValue) => {
  if (typeof value === 'string') {
    if (value.trim().length === 0) {
      throw new Error('Invalid input - must not be empty.');
    }
  }
};

export const validateNumber = (number: number) => {
  if (isNaN(number)) {
    throw new Error('Invalid number input.');
  }
};
