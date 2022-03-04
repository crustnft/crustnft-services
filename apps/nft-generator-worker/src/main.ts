import './utils/load-env';
import app from './app';
import { isCloudFunctions } from './utils/runtime-environment';
import { Logger } from '@crustnft-explore/util-config-api';

const port = process.env.PORT || 3002;

const logger = Logger('main');

if (!isCloudFunctions()) {
  app
    .listen(port, () => {
      logger.info(`Listening at http://localhost:${port}`);
    })
    .on('error', logger.error);
}

export const api = app;
