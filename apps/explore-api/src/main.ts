import './utils/load-env';
import app from './app';
import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import { isCloudFunctions } from './utils/runtime-environment';

const port = process.env.PORT || 3000;

if (!isCloudFunctions()) {
  app
    .listen(port, () => {
      console.info(`Listening at http://localhost:${port}`);
    })
    .on('error', console.error);
}

export const api: HttpFunction = app.callback();
