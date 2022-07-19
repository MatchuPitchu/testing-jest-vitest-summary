export const showError = (message: string) => {
  const errorContainerElement = document.getElementById('errors')!;
  const errorMessageElement = document.createElement('p');
  errorMessageElement.textContent = message;
  errorContainerElement.innerHTML = '';
  errorContainerElement.append(errorMessageElement);
};
