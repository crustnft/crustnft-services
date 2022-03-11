import pino from 'pino';

const SEVERITY_LOOKUP = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

const gcpPinoConfig = {
  messageKey: 'message',
  formatters: {
    level(label: string, number: number) {
      return {
        severity: SEVERITY_LOOKUP[label] || SEVERITY_LOOKUP['info'],
        level: number,
      };
    },
    log(message: unknown) {
      return { message };
    },
  },
};

export const pinoLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...gcpPinoConfig,
});
