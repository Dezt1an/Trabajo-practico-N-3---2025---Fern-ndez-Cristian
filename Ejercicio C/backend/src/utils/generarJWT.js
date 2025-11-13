import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generarJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '4h',
  });
};