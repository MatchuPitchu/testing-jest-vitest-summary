import { calculateResult } from './math';
import { generateResultText, outputResult } from './output';
import { getFormInputs } from './parser';
import './style.css';

const form = document.querySelector('form') as HTMLFormElement;

const formSubmitHandler = (event: SubmitEvent) => {
  event.preventDefault();

  const numberInputs = getFormInputs(event.currentTarget as HTMLFormElement);

  const result = calculateResult(numberInputs as string[]);
  const resultText = generateResultText(result);

  outputResult(resultText);
};

form.addEventListener('submit', formSubmitHandler);
