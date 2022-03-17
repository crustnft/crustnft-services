import tracer from 'tracer';
import { isTest, isLocal } from '../environment';
import { pinoLogger } from './pino';

const localLogger = tracer.colorConsole();

export function Logger(namespace: string) {
  return isLocal() || isTest() ? localLogger : pinoLogger.child({ namespace });
}
