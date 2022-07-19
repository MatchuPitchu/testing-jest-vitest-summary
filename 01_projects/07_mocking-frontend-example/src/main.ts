import { extractPostData, savePost } from './posts/posts';
import { showError } from './util/dom';

const formElement = document.querySelector('form') as HTMLFormElement;

export const submitFormHandler = async (event: SubmitEvent) => {
  event.preventDefault();

  const formData = new FormData(formElement);

  try {
    const postData = extractPostData(formData);
    await savePost(postData);
  } catch (error: any) {
    showError(error.message);
  }
};

formElement.addEventListener('submit', submitFormHandler);
