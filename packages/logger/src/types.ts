export const LogLevel = {
  TRACE: 'trace',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

export type LogLevelValue = typeof LogLevel[keyof typeof LogLevel];

export interface LoggerConfig {
  /** Log level. Defaults to 'info' */
  level?: LogLevelValue | string;
  /** Logger name, included in output */
  name?: string;
  /** Enable pretty printing (requires pino-pretty installed). Defaults to false */
  pretty?: boolean;
  /** Custom serializers for complex objects */
  serializers?: Record<string, (value: any) => any>;
}
