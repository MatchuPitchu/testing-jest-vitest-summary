import jwt from 'jsonwebtoken';

export const generateToken = (userEmail, doneFn) => {
  jwt.sign({ email: userEmail }, 'secret123', doneFn);
};
