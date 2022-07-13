import { cleanNumbers } from './util/numbers';

export const add = (...args: number[]) => {
  return args.reduce((acc, current) => acc + current, 0);
};

export const calculateResult = (numberInputs: string[]) => {
  let result = '';
  try {
    const numbers = cleanNumbers(numberInputs);
    result = add(...numbers).toString();
  } catch (error: any) {
    result = error.message;
  }

  return result;
};
