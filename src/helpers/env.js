import { config } from 'dotenv';
import args from './arguments.herlpers.js';
import logger from './logger.helper.js';

const { mode } = args;

const path = `.env.${mode}`;
logger.INFO(`📄 Cargando archivo de entorno: ${path}`);
logger.INFO(`🟢 Modo detectado: ${mode}`);

config({ path });

export const PORT = process.env.PORT;
export const MONGO_URL = process.env.MONGO_URL;
export const SECRET_WORD = process.env.SECRET_WORD;
export const SECRET_COOKIE = process.env.SECRET_COOKIE;
