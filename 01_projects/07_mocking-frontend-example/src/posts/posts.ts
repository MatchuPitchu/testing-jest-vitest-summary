import { sendDataRequest } from '../util/http';
import { validateNotEmpty } from '../util/validation';

export const savePost = (postData: any) => {
  postData.created = new Date();
  return sendDataRequest(postData);
};

export const extractPostData = (form: FormData) => {
  const title = form.get('title');
  const content = form.get('content');

  if (!title || !content) return;

  validateNotEmpty(title, 'A title must be provided.');
  validateNotEmpty(content, 'Content must not be empty!');

  return { title, content };
};
