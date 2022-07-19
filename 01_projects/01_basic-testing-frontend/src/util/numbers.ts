import { validateNumber, validateStringNotEmpty } from './validation';

export const transformStringToNumber = (value: FormDataEntryValue) => +value;

export const cleanNumbers = (numberInputs: string[]) => {
  const numbers: number[] = [];

  for (const numberInput of numberInputs) {
    if (numberInput) {
      validateStringNotEmpty(numberInput); // would not be needed normally in my implementation
      const number = transformStringToNumber(numberInput);
      validateNumber(number); // would not be needed with TypeScript
      numbers.push(number);
    }
  }
  return numbers;
};
