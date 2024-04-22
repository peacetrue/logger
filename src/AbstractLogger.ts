import {Logger, LOGGER_LEVELS, LoggerLevel} from "./Logger";

export abstract class AbstractLogger implements Logger {

  abstract get level() ;

  abstract set level(level: LoggerLevel);

  protected isLevelEnabled(level: LoggerLevel): boolean {
    return LOGGER_LEVELS.indexOf(this.level) >= LOGGER_LEVELS.indexOf(level);
  }

  protected log(level: LoggerLevel, msg: any, ...args: any[]): void {
    if (this.isLevelEnabled(level)) {
      this.doLog(level, msg, ...args);
    }
  }

  abstract doLog(level: LoggerLevel, msg: any, ...args: any[]): void;

  isTraceEnabled(): boolean {
    return this.isLevelEnabled("TRACE");
  }

  isDebugEnabled(): boolean {
    return this.isLevelEnabled("DEBUG");
  }

  isInfoEnabled(): boolean {
    return this.isLevelEnabled("INFO");
  }

  isWarnEnabled(): boolean {
    return this.isLevelEnabled("WARN");
  }

  isErrorEnabled(): boolean {
    return this.isLevelEnabled("ERROR");
  }

  trace(message: any, ...args: any[]): void {
    this.log("TRACE", message, ...args);
  }

  debug(message: any, ...args: any[]): void {
    this.log("DEBUG", message, ...args);
  }

  info(message: any, ...args: any[]): void {
    this.log("INFO", message, ...args);
  }

  warn(message: any, ...args: any[]): void {
    this.log("WARN", message, ...args);
  }

  error(message: any, ...args: any[]): void {
    this.log("ERROR", message, ...args);
  }
}


