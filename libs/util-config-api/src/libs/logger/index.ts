import pino from 'pino';
import tracer from 'tracer';
import { isLocal } from '../environment';

const localLogger = tracer.colorConsole();
const pinoLogger = pino();

export function Logger(namespace: string) {
  return isLocal() ? localLogger : pinoLogger.child({ namespace });
}
