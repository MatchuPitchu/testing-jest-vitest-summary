import { validateStringNotEmpty, validateNumber } from './util/validation';
import { add } from './math';
import { transformStringToNumber } from './util/numbers';
import './style.css';

const form = document.querySelector('form') as HTMLFormElement;
const output = document.getElementById('result') as HTMLElement;

const formSubmitHandler = (event: SubmitEvent) => {
  event.preventDefault();

  const form = new FormData(event.currentTarget as HTMLFormElement);

  const num1 = form.get('num1');
  const num2 = form.get('num2');
  const numberInputs = [num1, num2];

  let result = '';

  try {
    const numbers: number[] = [];
    for (const numberInput of numberInputs) {
      if (numberInput) {
        validateStringNotEmpty(numberInput); // would not be needed normally in my implementation
        const number = transformStringToNumber(numberInput);
        validateNumber(number); // would not be needed with TypeScript
        numbers.push(number);
      }
    }
    result = add(...numbers).toString();
  } catch (error: any) {
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
