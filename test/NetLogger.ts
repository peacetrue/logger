import {DEFAULT_LOGGER_LEVEL, Logger, LoggerLevel} from "../src/Logger";
import {AbstractLogger} from "../src/AbstractLogger";

export type LogInfo = {
  timestamp: number,
  level: LoggerLevel,
  msg: any,
  args?: any[],
}

export class NetLogger extends AbstractLogger {

  url: string;
  stringify: (log: LogInfo) => string;

  constructor(level: LoggerLevel = DEFAULT_LOGGER_LEVEL,
              url: string = "/logs",
              stringify = JSON.stringify) {
    super(level);
    this.url = url;
    this.stringify = stringify;
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
