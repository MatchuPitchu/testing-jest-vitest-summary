import { HttpError } from './errors.js';

export const sendDataRequest = async (data: any) => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch('https://dummy-site.dev/posts', options);

  const responseData = await response.json();

  if (!response.ok) {
    throw new HttpError(response.status, 'Sending the request failed.', responseData);
  }

  return responseData;
};
