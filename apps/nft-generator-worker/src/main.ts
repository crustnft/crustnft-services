import './utils/load-env';
import app from './app';
import { isCloudFunctions } from './utils/runtime-environment';

const port = process.env.PORT || 3002;

if (!isCloudFunctions()) {
  app
    .listen(port, () => {
      console.info(`Listening at http://localhost:${port}`);
    })
    .on('error', console.error);
}

export const api = app;
