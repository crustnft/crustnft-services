import pino from 'pino';
import tracer from 'tracer';
import { isLocal } from '../environment';

const localLogger = tracer.colorConsole();
const pinoLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

export function Logger(namespace: string) {
  return isLocal() ? localLogger : pinoLogger.child({ namespace });
}
