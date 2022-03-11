import tracer from 'tracer';
import { isLocal } from '../environment';
import { pinoLogger } from './pino';

const localLogger = tracer.colorConsole();

export function Logger(namespace: string) {
  return isLocal() ? localLogger : pinoLogger.child({ namespace });
}
