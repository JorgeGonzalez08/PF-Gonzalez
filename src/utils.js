import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import logger from './helpers/logger.helper.js';

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

export const processError = (error, res) => {
  logger.ERROR(error);
  res.setHeader('Content-Type', 'application/json');
  res.status(500).json({ status: 'error', message: `${error.message}` });
};

export const ticketId = () => uuidv4();

export const totalize = (products) =>
  products.reduce(
    (total, product) => total + product.product.price * product.quantity,
    0
  );

export const buyTime = () => format(new Date(), 'dd/MM/yyyy HH:mm:ss');
