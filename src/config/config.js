import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const mongoUrl = process.env.MONGO_URL;
export const secretWord = process.env.SECRET_WORD;
export const secretCookie = process.env.SECRET_COOKIE;
