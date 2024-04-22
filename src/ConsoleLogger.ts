import {DEFAULT_LOGGER_LEVEL, LOGGER_LEVELS, LoggerConstructor, LoggerLevel} from "./Logger";
import {AbstractLogger} from "./AbstractLogger";

const rightPad = function (src: string, length: number, paddingChar = ' ') {
  if (src.length >= length) return src;
  return src + paddingChar.repeat(length - src.length);
}

const levelMaxLength = Math.max(...LOGGER_LEVELS.map(item => item.length));

// 用于修改 console 后进行测试
let _console: any = console;
export const _setLocalConsole = (console: object) => _console = console;

export function formatLevel(level: "OFF" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE") {
  return `[${rightPad(level, levelMaxLength)}]`;
}

export class ConsoleLogger extends AbstractLogger {

  private _level: LoggerLevel;

  constructor(level: LoggerLevel = DEFAULT_LOGGER_LEVEL) {
    super();
    this._level = level;
  }

  get level(): LoggerLevel {
    return this._level;
  }

  set level(value: LoggerLevel) {
    this._level = value;
  }

  doLog(level: LoggerLevel, msg: any, ...args: any[]) {
    let lowerLevel = level.toLowerCase();
    // @ts-ignore
    _console[lowerLevel in _console ? lowerLevel : "log"](formatLevel(level), msg, ...args);
  }
}

export const consoleLoggerConstructor: LoggerConstructor = (level) => new ConsoleLogger(level);
export const consoleLogger = new ConsoleLogger();
