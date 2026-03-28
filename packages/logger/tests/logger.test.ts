import { Logger, createLogger, getLogger, _resetSingleton } from '../src/logger';
import { LogLevel } from '../src/types';

// Mock pino
const mockChild = jest.fn();
const mockTrace = jest.fn();
const mockDebug = jest.fn();
const mockInfo = jest.fn();
const mockWarn = jest.fn();
const mockError = jest.fn();
const mockFatal = jest.fn();

const mockPinoInstance = {
  trace: mockTrace,
  debug: mockDebug,
  info: mockInfo,
  warn: mockWarn,
  error: mockError,
  fatal: mockFatal,
  child: mockChild.mockReturnValue({
    trace: mockTrace,
    debug: mockDebug,
    info: mockInfo,
    warn: mockWarn,
    error: mockError,
    fatal: mockFatal,
    child: mockChild,
  }),
};

jest.mock('pino', () => {
  const fn = jest.fn(() => mockPinoInstance);
  (fn as any).transport = jest.fn();
  return { __esModule: true, default: fn };
});

beforeEach(() => {
  jest.clearAllMocks();
  _resetSingleton();
});

describe('Logger', () => {
  describe('construction', () => {
    test('creates with default config', () => {
      const logger = new Logger();
      expect(logger).toBeInstanceOf(Logger);
    });

    test('creates with custom config', () => {
      const logger = new Logger({ level: 'debug', name: 'test-app' });
      expect(logger).toBeInstanceOf(Logger);
    });

    test('creates with pretty mode', () => {
      const logger = new Logger({ pretty: true });
      expect(logger).toBeInstanceOf(Logger);
    });

    test('creates with custom serializers', () => {
      const logger = new Logger({
        serializers: {
          user: (value: any) => ({ id: value.id }),
        },
      });
      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe('log methods', () => {
    let logger: Logger;
    beforeEach(() => {
      logger = new Logger();
    });

    test('trace logs message', () => {
      logger.trace('test message');
      expect(mockTrace).toHaveBeenCalledWith('test message');
    });

    test('trace logs message with metadata', () => {
      logger.trace('test message', { key: 'value' });
      expect(mockTrace).toHaveBeenCalledWith({ key: 'value' }, 'test message');
    });

    test('debug logs message', () => {
      logger.debug('debug msg');
      expect(mockDebug).toHaveBeenCalledWith('debug msg');
    });

    test('debug logs message with metadata', () => {
      logger.debug('debug msg', { a: 1 });
      expect(mockDebug).toHaveBeenCalledWith({ a: 1 }, 'debug msg');
    });

    test('info logs message', () => {
      logger.info('info msg');
      expect(mockInfo).toHaveBeenCalledWith('info msg');
    });

    test('info logs message with metadata', () => {
      logger.info('info msg', { data: true });
      expect(mockInfo).toHaveBeenCalledWith({ data: true }, 'info msg');
    });

    test('warn logs message', () => {
      logger.warn('warn msg');
      expect(mockWarn).toHaveBeenCalledWith('warn msg');
    });

    test('warn logs message with metadata', () => {
      logger.warn('warn msg', { level: 'high' });
      expect(mockWarn).toHaveBeenCalledWith({ level: 'high' }, 'warn msg');
    });

    test('error logs message only', () => {
      logger.error('error msg');
      expect(mockError).toHaveBeenCalledWith('error msg');
    });

    test('error logs message with Error object', () => {
      const error = new Error('something failed');
      logger.error('error msg', error);
      expect(mockError).toHaveBeenCalledWith({ err: error }, 'error msg');
    });

    test('error logs message with Error and metadata', () => {
      const error = new Error('fail');
      logger.error('error msg', error, { requestId: '123' });
      expect(mockError).toHaveBeenCalledWith(
        { requestId: '123', err: error },
        'error msg'
      );
    });

    test('fatal logs message only', () => {
      logger.fatal('fatal msg');
      expect(mockFatal).toHaveBeenCalledWith('fatal msg');
    });

    test('fatal logs message with Error object', () => {
      const error = new Error('critical failure');
      logger.fatal('fatal msg', error);
      expect(mockFatal).toHaveBeenCalledWith({ err: error }, 'fatal msg');
    });

    test('fatal logs message with Error and metadata', () => {
      const error = new Error('critical');
      logger.fatal('fatal msg', error, { service: 'api' });
      expect(mockFatal).toHaveBeenCalledWith(
        { service: 'api', err: error },
        'fatal msg'
      );
    });
  });

  describe('child', () => {
    test('creates child logger with bindings', () => {
      const logger = new Logger();
      const child = logger.child({ requestId: 'abc-123' });
      expect(child).toBeInstanceOf(Logger);
      expect(mockChild).toHaveBeenCalledWith({ requestId: 'abc-123' });
    });

    test('child logger can log', () => {
      const logger = new Logger();
      const child = logger.child({ userId: 'u1' });
      child.info('child message');
      expect(mockInfo).toHaveBeenCalled();
    });
  });

  describe('time', () => {
    test('returns a function', () => {
      const logger = new Logger();
      const end = logger.time('operation');
      expect(typeof end).toBe('function');
    });

    test('calling returned function logs elapsed time', () => {
      const logger = new Logger();
      const end = logger.time('db-query');
      end();
      expect(mockDebug).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'db-query',
          elapsed: expect.any(Number),
        }),
        expect.stringContaining('db-query completed in')
      );
    });
  });

  describe('pinoInstance', () => {
    test('returns the underlying pino instance', () => {
      const logger = new Logger();
      expect(logger.pinoInstance).toBe(mockPinoInstance);
    });
  });
});

describe('createLogger', () => {
  test('creates a new Logger each time', () => {
    const l1 = createLogger();
    const l2 = createLogger();
    expect(l1).not.toBe(l2);
  });

  test('passes config to Logger', () => {
    const logger = createLogger({ level: 'warn', name: 'my-app' });
    expect(logger).toBeInstanceOf(Logger);
  });
});

describe('getLogger', () => {
  test('returns same instance on subsequent calls', () => {
    const l1 = getLogger();
    const l2 = getLogger();
    expect(l1).toBe(l2);
  });

  test('first call uses provided config', () => {
    const logger = getLogger({ name: 'singleton' });
    expect(logger).toBeInstanceOf(Logger);
  });

  test('resets correctly with _resetSingleton', () => {
    const l1 = getLogger();
    _resetSingleton();
    const l2 = getLogger();
    expect(l1).not.toBe(l2);
  });
});

describe('LogLevel', () => {
  test('has all expected levels', () => {
    expect(LogLevel.TRACE).toBe('trace');
    expect(LogLevel.DEBUG).toBe('debug');
    expect(LogLevel.INFO).toBe('info');
    expect(LogLevel.WARN).toBe('warn');
    expect(LogLevel.ERROR).toBe('error');
    expect(LogLevel.FATAL).toBe('fatal');
  });
});
