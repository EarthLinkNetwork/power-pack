import pino from 'pino';
import type { Logger as PinoLogger } from 'pino';
import type { LoggerConfig } from './types';

export class Logger {
  private _pino: PinoLogger;

  constructor(config: LoggerConfig = {}) {
    const { level = 'info', name, pretty = false, serializers } = config;

    const options: pino.LoggerOptions = {
      level,
      ...(name && { name }),
      ...(serializers && { serializers }),
    };

    if (pretty) {
      try {
        // pino-pretty is an optional peer dependency
        this._pino = pino(options, pino.transport({ target: 'pino-pretty' }));
      } catch {
        // Fallback to JSON if pino-pretty is not installed
        this._pino = pino(options);
      }
    } else {
      this._pino = pino(options);
    }
  }

  /** Create a Logger wrapping an existing pino instance */
  private static fromPino(pinoInstance: PinoLogger): Logger {
    const logger = Object.create(Logger.prototype) as Logger;
    logger._pino = pinoInstance;
    return logger;
  }

  trace(msg: string, obj?: Record<string, unknown>): void {
    obj ? this._pino.trace(obj, msg) : this._pino.trace(msg);
  }

  debug(msg: string, obj?: Record<string, unknown>): void {
    obj ? this._pino.debug(obj, msg) : this._pino.debug(msg);
  }

  info(msg: string, obj?: Record<string, unknown>): void {
    obj ? this._pino.info(obj, msg) : this._pino.info(msg);
  }

  warn(msg: string, obj?: Record<string, unknown>): void {
    obj ? this._pino.warn(obj, msg) : this._pino.warn(msg);
  }

  error(msg: string, error?: Error, obj?: Record<string, unknown>): void {
    const mergedObj = { ...(obj || {}), ...(error && { err: error }) };
    Object.keys(mergedObj).length > 0
      ? this._pino.error(mergedObj, msg)
      : this._pino.error(msg);
  }

  fatal(msg: string, error?: Error, obj?: Record<string, unknown>): void {
    const mergedObj = { ...(obj || {}), ...(error && { err: error }) };
    Object.keys(mergedObj).length > 0
      ? this._pino.fatal(mergedObj, msg)
      : this._pino.fatal(msg);
  }

  /**
   * Create a child logger with additional bound context.
   * Useful for adding requestId, userId, etc.
   */
  child(bindings: Record<string, unknown>): Logger {
    return Logger.fromPino(this._pino.child(bindings));
  }

  /**
   * Start a performance timer. Returns a function that,
   * when called, logs the elapsed time as a debug message.
   */
  time(label: string): () => void {
    const start = Date.now();
    return () => {
      const elapsed = Date.now() - start;
      this._pino.debug({ elapsed, label }, `${label} completed in ${elapsed}ms`);
    };
  }

  /** Access the underlying pino instance for advanced usage */
  get pinoInstance(): PinoLogger {
    return this._pino;
  }
}

/**
 * Create a new Logger instance.
 */
export function createLogger(config?: LoggerConfig): Logger {
  return new Logger(config);
}

let _singleton: Logger | null = null;

/**
 * Get or create a singleton Logger instance.
 * First call creates the logger with the provided config.
 * Subsequent calls return the same instance (config is ignored).
 */
export function getLogger(config?: LoggerConfig): Logger {
  if (!_singleton) {
    _singleton = new Logger(config);
  }
  return _singleton;
}

// Exported for testing only - resets the singleton
export function _resetSingleton(): void {
  _singleton = null;
}
