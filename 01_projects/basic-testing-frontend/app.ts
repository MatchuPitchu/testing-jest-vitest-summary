import { validateStringNotEmpty, validateNumber } from './src/util/validation';
import { add } from './src/math';
import { transformStringToNumber } from './src/util/numbers';

const form = document.querySelector('form') as HTMLFormElement;
const output = document.getElementById('result') as HTMLElement;

const formSubmitHandler = (event: SubmitEvent) => {
  event.preventDefault();

  const numberInputs = [event.currentTarget?.[0].value, event.currentTarget?.[1].value];

  let result = '';

  try {
    const numbers: number[] = [];
    for (const numberInput of numberInputs) {
      if (numberInput) {
        validateStringNotEmpty(numberInput);
        const number = transformStringToNumber(numberInput);
        validateNumber(number);
        numbers.push(number);
      }
    }
    result = add(...numbers).toString();
  } catch (error) {
    result = error.message;
  }

  let resultText = '';

  if (result === 'invalid') {
    resultText = 'Invalid input. You must enter valid numbers.';
  } else if (result !== 'no-calc') {
    resultText = 'Result: ' + result;
  }

  output.textContent = resultText;
};

form.addEventListener('submit', formSubmitHandler);
