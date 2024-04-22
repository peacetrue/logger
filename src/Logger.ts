/** 日志级别 */
export type LoggerLevel = 'OFF' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';
export const LOGGER_LEVELS: LoggerLevel[] = ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
/** 默认日志级别 */
export const DEFAULT_LOGGER_LEVEL = 'INFO';

/** 日志 */
export interface Logger {
  level: LoggerLevel;

  isTraceEnabled(): boolean;

  isDebugEnabled(): boolean;

  isInfoEnabled(): boolean;

  isWarnEnabled(): boolean;

  isErrorEnabled(): boolean;

  // addContext(key: string, value: any): void;
  //
  // removeContext(key: string): void;
  //
  // clearContext(): void;

  trace(message: any, ...args: any[]): void;

  debug(message: any, ...args: any[]): void;

  info(message: any, ...args: any[]): void;

  warn(message: any, ...args: any[]): void;

  error(message: any, ...args: any[]): void;
}

class NoopLogger implements Logger {

  level: LoggerLevel;

  constructor(level: LoggerLevel) {
    this.level = level;
  }

  isDebugEnabled(): boolean {
    return false;
  }

  isErrorEnabled(): boolean {
    return false;
  }

  isInfoEnabled(): boolean {
    return false;
  }

  isTraceEnabled(): boolean {
    return false;
  }

  isWarnEnabled(): boolean {
    return false;
  }

  debug(_message: any, ..._args: any[]): void {
  }

  error(_message: any, ..._args: any[]): void {
  }

  info(_message: any, ..._args: any[]): void {
  }

  trace(_message: any, ..._args: any[]): void {
  }

  warn(_message: any, ..._args: any[]): void {
  }

}

/** 日志构造器 */
export type LoggerConstructor = (level: LoggerLevel) => Logger;

export const noopLoggerConstructor = (level: LoggerLevel) => new NoopLogger(level);
export const noopLogger = new NoopLogger('OFF');
