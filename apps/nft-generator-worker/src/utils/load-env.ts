import dotenv from 'dotenv';
import path from 'path';

const APP_ENV = process.env.APP_ENV || 'local';
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${APP_ENV}`),
});
