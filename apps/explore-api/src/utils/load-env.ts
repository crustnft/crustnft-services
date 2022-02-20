import dotenv from 'dotenv';
import path from 'path';
const APP_ENV = process.env.APP_ENV || 'local';

export function loadDotEnv() {
  dotenv.config({
    path: path.resolve(process.cwd(), `.${APP_ENV}.env`),
  });
}
