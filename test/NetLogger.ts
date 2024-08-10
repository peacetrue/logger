import {DEFAULT_LOGGER_LEVEL, Logger, LoggerLevel} from "../src/Logger";
import {AbstractLogger} from "../src/AbstractLogger";

export type LogInfo = {
  timestamp: number,
  level: LoggerLevel,
  msg: any,
  args?: any[],
}

export class NetLogger extends AbstractLogger {

  private _level: LoggerLevel;
  url: string;
  stringify: (log: LogInfo) => string;

  constructor(level: LoggerLevel = DEFAULT_LOGGER_LEVEL,
              url: string = "/logs",
              stringify = JSON.stringify) {
    super();
    this._level = level;
    this.url = url;
    this.stringify = stringify;
  }

  get level(): LoggerLevel {
    return this._level;
  }

  set level(value: LoggerLevel) {
    this._level = value;
  }

  doLog(level: LoggerLevel, msg: any, ...args: any[]): Promise<Response> {
    return fetch(this.url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: this.stringify({
        level: level,
        timestamp: Date.now(),
        msg,
        args,
      })
    });
  }
}

export const netLoggerConstructor = (level: LoggerLevel): Logger => new NetLogger(level, "/logs");
export const netLogger = new NetLogger();
