export const getFormInputs = (formElement: HTMLFormElement) => {
  const form = new FormData(formElement);

  const num1 = form.get('num1');
  const num2 = form.get('num2');
  return [num1, num2];
};
