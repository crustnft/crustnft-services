import { Logger } from '@crustnft-explore/util-config-api';
import storage from '../../clients/storage';

const logger = Logger('cleanup-worker:service');

export async function startCleanUp() {
  logger.info(`Start cleanup at: ${new Date().toISOString()}`);
  logger.info(`Finished cleanup at: ${new Date().toISOString()}`);
}
