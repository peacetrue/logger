/** 日志级别常量 */
export const LOGGER_LEVELS = ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'] as const;
/** 日志级别 */
export type LoggerLevel = typeof LOGGER_LEVELS[number];
/** 默认日志级别 */
export const DEFAULT_LOGGER_LEVEL: LoggerLevel = 'INFO';

/** 日志 */
export interface Logger {
  level: LoggerLevel;

  isTraceEnabled(): boolean;

  isDebugEnabled(): boolean;

  isInfoEnabled(): boolean;

  isWarnEnabled(): boolean;

  isErrorEnabled(): boolean;

  trace(message: any, ...args: any[]): void;

  debug(message: any, ...args: any[]): void;

  info(message: any, ...args: any[]): void;

  warn(message: any, ...args: any[]): void;

  error(message: any, ...args: any[]): void;
}

export class NoopLogger implements Logger {
  constructor(public level: LoggerLevel = 'OFF') {}

  isTraceEnabled(): boolean {
    return false;
  }

  isDebugEnabled(): boolean {
    return false;
  }

  isInfoEnabled(): boolean {
    return false;
  }

  isWarnEnabled(): boolean {
    return false;
  }

  isErrorEnabled(): boolean {
    return false;
  }

  trace(_message: any, ..._args: any[]): void {}

  debug(_message: any, ..._args: any[]): void {}

  info(_message: any, ..._args: any[]): void {}

  warn(_message: any, ..._args: any[]): void {}

  error(_message: any, ..._args: any[]): void {}
}

/** 日志构造器 */
export type LoggerConstructor = (level: LoggerLevel) => Logger;

export const noopLoggerConstructor: LoggerConstructor = (level: LoggerLevel) => new NoopLogger(level);
export const noopLogger = new NoopLogger('OFF');
