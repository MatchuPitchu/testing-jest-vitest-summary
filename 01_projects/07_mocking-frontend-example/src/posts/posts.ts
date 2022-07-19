import { sendDataRequest } from '../util/http';
import { validateNotEmpty } from '../util/validation';

export const savePost = (postData: any) => {
  postData.created = new Date();
  return sendDataRequest(postData);
};

export const extractPostData = (form: FormData) => {
  const title = form.get('title');
  const content = form.get('content');

  validateNotEmpty(title as string, 'A title must be provided.');
  validateNotEmpty(content as string, 'Content must not be empty!');

  return { title, content };
};
